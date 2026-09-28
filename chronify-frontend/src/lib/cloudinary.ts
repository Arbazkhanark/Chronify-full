// src/lib/cloudinary.ts

/* ============================================================================
   CLOUDINARY UNSIGNED UPLOAD HELPER
   ============================================================================
   Uses the "unsigned" upload preset so no API secret is exposed to the
   browser. Cloud name + upload preset come from NEXT_PUBLIC_ env vars.

   Setup (one-time):
   1. cloudinary.com → Dashboard → copy "Cloud name"
   2. Settings → Upload → Upload presets → Add upload preset
      - Signing Mode: Unsigned
      - Preset name: chronify_unsigned (or your own)
   3. Add to .env.local:
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=chronify_unsigned
   ============================================================================ */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? ''

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  // Only warn in dev — don't crash the app if env vars are missing
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[cloudinary] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or ' +
        'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is missing. ' +
        'Image uploads will fail.'
    )
  }
}

export interface CloudinaryUploadResult {
  url: string
  secureUrl: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
  resourceType: string
  createdAt: string
}

export interface UploadOptions {
  /** Cloudinary folder (e.g. "chronify/profiles") */
  folder?: string
  /** Optional public ID */
  publicId?: string
  /** Progress callback: 0-100 */
  onProgress?: (percent: number) => void
}

/**
 * Upload an image file to Cloudinary using an unsigned upload preset.
 *
 * Uses XMLHttpRequest (not fetch) so we can report upload progress.
 */
export function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new Error(
          'Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ' +
            'and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local and restart dev server.'
        )
      )
      return
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    if (options.folder) formData.append('folder', options.folder)
    if (options.publicId) formData.append('public_id', options.publicId)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)

    // Progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && options.onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        options.onProgress(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        // Try to parse error
        let message = `Upload failed (HTTP ${xhr.status})`
        try {
          const parsed = JSON.parse(xhr.responseText)
          if (parsed?.error?.message) message = parsed.error.message
        } catch {
          /* ignore */
        }
        reject(new Error(message))
        return
      }

      try {
        const json = JSON.parse(xhr.responseText)
        resolve({
          url: json.url,
          secureUrl: json.secure_url,
          publicId: json.public_id,
          width: json.width,
          height: json.height,
          format: json.format,
          bytes: json.bytes,
          resourceType: json.resource_type,
          createdAt: json.created_at,
        })
      } catch (err) {
        reject(new Error('Malformed response from Cloudinary'))
      }
    }

    xhr.onerror = () => {
      reject(new Error('Network error while uploading to Cloudinary'))
    }

    xhr.ontimeout = () => {
      reject(new Error('Upload timed out'))
    }

    xhr.send(formData)
  })
}

/* ============================================================================
   VALIDATION
   ============================================================================ */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as any)) {
    return 'Only JPEG, PNG, WebP, and GIF are supported.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return `File is too large (${mb} MB). Max 5 MB.`
  }
  return null
}

/**
 * Compress / downscale an image before upload if it's larger than
 * `maxDimension` on either side. Uses canvas so it's browser-native.
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<File> {
  if (typeof document === 'undefined') return file

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      const scale = Math.min(1, maxDimension / Math.max(width, height))

      if (scale >= 1) {
        resolve(file)
        return
      }

      width = Math.round(width * scale)
      height = Math.round(height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          const compressed = new File(
            [blob],
            file.name.replace(/\.(jpe?g|png|webp|gif)$/i, '.jpg'),
            { type: 'image/jpeg', lastModified: Date.now() }
          )
          resolve(compressed)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}
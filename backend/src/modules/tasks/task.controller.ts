// src/modules/tasks/task.controller.ts
import { Request, Response } from "express"
import { TaskService } from "./task.service"
import {
  createTaskSchema,
  updateTaskSchema,
  bulkCreateTaskSchema,
  dragDropSchema,
  taskFilterSchema,
  bulkUpdateTaskSchema,
  bulkDeleteTaskSchema,
} from "./task.validation"
import { AuthRequest } from "../../middlewares/auth.middleware"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"
import { TaskFilterDTO } from "./task.types"
import z from "zod"

export class TaskController {
  static async createTask(req: AuthRequest, res: Response) {
    try {
        console.log('🚀 Create task route hit!')
      const payload = createTaskSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Create task API called", {
        functionName: "TaskController.createTask",
        metadata: { userId }
      })

      const task = await TaskService.createTask(userId, payload)

      logger.info("Task created successfully", {
        functionName: "TaskController.createTask",
        metadata: { userId, taskId: task.id, day: task.day }
      })

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      })
    } catch (err: any) {
      logger.error(`Create task failed: ${err.message}`, {
        functionName: "TaskController.createTask",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async getTask(req: AuthRequest, res: Response) {
    try {
      let { taskId } = req.params
      const userId = req.user!.id

      if (Array.isArray(taskId)) {
        taskId = taskId[0]
      }

      logger.info("Get task API called", {
        functionName: "TaskController.getTask",
        metadata: { userId, taskId }
      })

      const task = await TaskService.getTask(userId, taskId)

      logger.info("Task fetched successfully", {
        functionName: "TaskController.getTask",
        metadata: { userId, taskId }
      })

      res.status(200).json({
        success: true,
        data: task,
      })
    } catch (err: any) {
      logger.error(`Get task failed: ${err.message}`, {
        functionName: "TaskController.getTask",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async getTasks(req: AuthRequest, res: Response) {
    try {
      const filters = taskFilterSchema.parse(req.query)
      const userId = req.user!.id

      logger.info("Get tasks API called", {
        functionName: "TaskController.getTasks",
        metadata: { userId, filters }
      })

      const result = await TaskService.getTasks(userId, filters as TaskFilterDTO)

      logger.info("Tasks fetched successfully", {
        functionName: "TaskController.getTasks",
        metadata: { userId, count: result.total }
      })

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (err: any) {
      logger.error(`Get tasks failed: ${err.message}`, {
        functionName: "TaskController.getTasks",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async updateTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const payload = updateTaskSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update task API called", {
        functionName: "TaskController.updateTask",
        metadata: { userId, taskId }
      })

      const task = await TaskService.updateTask(userId, taskId, payload)

      logger.info("Task updated successfully", {
        functionName: "TaskController.updateTask",
        metadata: { userId, taskId }
      })

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
      })
    } catch (err: any) {
      logger.error(`Update task failed: ${err.message}`, {
        functionName: "TaskController.updateTask",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const userId = req.user!.id

      logger.info("Delete task API called", {
        functionName: "TaskController.deleteTask",
        metadata: { userId, taskId }
      })

      await TaskService.deleteTask(userId, taskId)

      logger.info("Task deleted successfully", {
        functionName: "TaskController.deleteTask",
        metadata: { userId, taskId }
      })

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      })
    } catch (err: any) {
      logger.error(`Delete task failed: ${err.message}`, {
        functionName: "TaskController.deleteTask",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async completeTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const userId = req.user!.id

      logger.info("Complete task API called", {
        functionName: "TaskController.completeTask",
        metadata: { userId, taskId }
      })

      const task = await TaskService.completeTask(userId, taskId)

      logger.info("Task completed successfully", {
        functionName: "TaskController.completeTask",
        metadata: { userId, taskId }
      })

      res.status(200).json({
        success: true,
        message: "Task completed successfully",
        data: task,
      })
    } catch (err: any) {
      logger.error(`Complete task failed: ${err.message}`, {
        functionName: "TaskController.completeTask",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async bulkCreateTasks(req: AuthRequest, res: Response) {
    try {
      // console.log(req.body,"Body--.............")
      const payload = bulkCreateTaskSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Bulk create tasks API called", {
        functionName: "TaskController.bulkCreateTasks",
        metadata: { userId, count: payload.tasks.length }
      })

      const tasks = await TaskService.bulkCreateTasks(userId, payload.tasks)

      logger.info("Tasks bulk created successfully", {
        functionName: "TaskController.bulkCreateTasks",
        metadata: { userId, count: tasks.length }
      })

      res.status(201).json({
        success: true,
        message: `${tasks.length} tasks created successfully`,
        data: tasks,
      })
    } catch (err: any) {
      logger.error(`Bulk create tasks failed: ${err.message}`, {
        functionName: "TaskController.bulkCreateTasks",
        metadata:{
            error: err.message,
            stack: err.stack,
        }
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }


  // src/modules/tasks/task.controller.ts

static async bulkUpdateTasks(req: AuthRequest, res: Response) {
  try {
    const payload = bulkUpdateTaskSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk update tasks API called", {
      functionName: "TaskController.bulkUpdateTasks",
      metadata: { userId, count: payload.updates.length }
    });

    const updatedTasks = await TaskService.bulkUpdateTasks(userId, payload.updates);

    logger.info("Tasks bulk updated successfully", {
      functionName: "TaskController.bulkUpdateTasks",
      metadata: { userId, count: updatedTasks.length }
    });

    res.status(200).json({
      success: true,
      message: `${updatedTasks.length} tasks updated successfully`,
      data: updatedTasks,
    });
  } catch (err: any) {
    logger.error(`Bulk update tasks failed: ${err.message}`, {
      functionName: "TaskController.bulkUpdateTasks",
      metadata: {
        error: err.message,
        stack: err.stack,
      }
    });

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message
      });
    }

    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}




// src/modules/tasks/task.controller.ts

static async bulkDeleteTasks(req: AuthRequest, res: Response) {
  try {
    const payload = bulkDeleteTaskSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk delete tasks API called", {
      functionName: "TaskController.bulkDeleteTasks",
      metadata: { userId, count: payload.taskIds.length }
    });

    const result = await TaskService.bulkDeleteTasks(userId, payload.taskIds);

    logger.info("Tasks bulk deleted successfully", {
      functionName: "TaskController.bulkDeleteTasks",
      metadata: { 
        userId, 
        deletedCount: result.count,
        deletedIds: payload.taskIds 
      }
    });

    res.status(200).json({
      success: true,
      message: `${result.count} tasks deleted successfully`,
      data: {
        deletedCount: result.count,
        deletedIds: payload.taskIds
      }
    });
  } catch (err: any) {
    logger.error(`Bulk delete tasks failed: ${err.message}`, {
      functionName: "TaskController.bulkDeleteTasks",
      metadata: {
        error: err.message,
        stack: err.stack,
      }
    });

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message
      });
    }

    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

  static async handleDragDrop1(req: AuthRequest, res: Response) {
    try {
      const payload = dragDropSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Drag drop API called", {
        functionName: "TaskController.handleDragDrop",
        metadata: { userId, taskId: payload.taskId, day: payload.day }
      })

      const task = await TaskService.handleDragDrop(userId, payload)

      logger.info("Drag drop handled successfully", {
        functionName: "TaskController.handleDragDrop",
        metadata: { userId, taskId: task.id }
      })

      res.status(200).json({
        success: true,
        message: "Task moved successfully",
        data: task,
      })
    } catch (err: any) {
      logger.error(`Drag drop failed: ${err.message}`, {
        functionName: "TaskController.handleDragDrop",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }



  static async handleDragDrop(req: AuthRequest, res: Response) {
  try {
    console.log("📦 Request body received:", JSON.stringify(req.body, null, 2)) // DEBUG
    console.log("📦 Headers:", req.headers) // DEBUG
    
    const payload = dragDropSchema.parse(req.body)
    const userId = req.user!.id

    logger.info("Drag drop API called", {
      functionName: "TaskController.handleDragDrop",
      metadata: { 
        userId, 
        taskId: payload.taskId, 
        day: payload.day,
        time: payload.time,
        duration: payload.duration 
      }
    })

    const task = await TaskService.handleDragDrop(userId, payload)

    logger.info("Drag drop handled successfully", {
      functionName: "TaskController.handleDragDrop",
      metadata: { userId, taskId: task.id }
    })

    res.status(200).json({
      success: true,
      message: "Task moved successfully",
      data: task,
    })
  } catch (err: any) {
    console.error("❌ Drag drop error details:", err) // DEBUG
    
    logger.error(`Drag drop failed: ${err.message}`, {
      functionName: "TaskController.handleDragDrop",
      metadata:{
          error: err.message,
          stack: err.stack,
          requestBody: req.body // Log request body
      }
    })

    if (err instanceof AppError) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message })
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

  static async getTasksByDay(req: AuthRequest, res: Response) {
    try {
      const { day } = req.params
      const userId = req.user!.id

      logger.info("Get tasks by day API called", {
        functionName: "TaskController.getTasksByDay",
        metadata: { userId, day }
      })

      const tasks = await TaskService.getTasksByDay(userId, day)

      logger.info("Tasks by day fetched successfully", {
        functionName: "TaskController.getTasksByDay",
        metadata: { userId, day, count: tasks.length }
      })

      res.status(200).json({
        success: true,
        data: tasks,
      })
    } catch (err: any) {
      logger.error(`Get tasks by day failed: ${err.message}`, {
        functionName: "TaskController.getTasksByDay",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async getTasksByGoal(req: AuthRequest, res: Response) {
    try {
      const { goalId } = req.params
      const userId = req.user!.id

      logger.info("Get tasks by goal API called", {
        functionName: "TaskController.getTasksByGoal",
        metadata: { userId, goalId }
      })

      const tasks = await TaskService.getTasksByGoal(userId, goalId)

      logger.info("Tasks by goal fetched successfully", {
        functionName: "TaskController.getTasksByGoal",
        metadata: { userId, goalId, count: tasks.length }
      })

      res.status(200).json({
        success: true,
        data: tasks,
      })
    } catch (err: any) {
      logger.error(`Get tasks by goal failed: ${err.message}`, {
        functionName: "TaskController.getTasksByGoal",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  static async getStatistics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info("Get task statistics API called", {
        functionName: "TaskController.getStatistics",
        metadata: { userId }
      })

      const stats = await TaskService.getStatistics(userId)

      logger.info("Task statistics fetched successfully", {
        functionName: "TaskController.getStatistics",
        metadata: { userId }
      })

      res.status(200).json({
        success: true,
        data: stats,
      })
    } catch (err: any) {
      logger.error(`Get statistics failed: ${err.message}`, {
        functionName: "TaskController.getStatistics",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }
}
package handlers

import (
	"task-management-system/database"
	"task-management-system/models"

	"github.com/gofiber/fiber/v2"
)

func CreateTask(c *fiber.Ctx) error {
	var task models.Task
	if err := c.BodyParser(&task); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Save the task to the database
	if err := database.DB.Create(&task).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create task"})
	}

	return c.Status(fiber.StatusCreated).JSON(task)
}

func GetTasks(c *fiber.Ctx) error {
	var tasks []models.Task
	if err := database.DB.Find(&tasks).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve tasks"})
	}

	return c.JSON(tasks)
}

// UpdateTask updates the status of a task
func UpdateTask(c *fiber.Ctx) error {
	taskID := c.Params("id")
	var task models.Task

	// Find the task by ID
	if err := database.DB.First(&task, taskID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Task not found"})
	}

	// Update the task with new data
	if err := c.BodyParser(&task); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Save the updated task
	if err := database.DB.Save(&task).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update task"})
	}

	return c.JSON(task)
}

func DeleteTask(c *fiber.Ctx) error {
	taskID := c.Params("id")
	if err := database.DB.Delete(&models.Task{}, taskID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete task"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

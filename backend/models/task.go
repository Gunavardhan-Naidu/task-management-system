package models

import (
	"time"
)

type Task struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	AssignedTo  uint      `json:"assigned_to"`                     // User ID of the assignee
	Status      string    `json:"status" gorm:"default:'pending'"` // e.g., pending, in-progress, completed
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email     string `json:"email" gorm:"unique"`
	Password  string `json:"-"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role" gorm:"default:'customer'"`
}

type Book struct {
	ID            uint    `json:"id" gorm:"primaryKey"`
	Title         string  `json:"title"`
	Author        string  `json:"author"`
	Description   string  `json:"description"`
	Price         float64 `json:"price"`
	StockQuantity int     `json:"stock_quantity"`
	ImageURL      string  `json:"image_url"`
	Category      string  `json:"category"`
}

type Order struct {
	ID          uint        `json:"id" gorm:"primaryKey"`
	UserID      uint        `json:"user_id"`
	TotalAmount float64     `json:"total_amount"`
	Status      string      `json:"status" gorm:"default:'New'"`
	CreatedAt   time.Time   `json:"created_at"`
	Items       []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID              uint    `json:"id" gorm:"primaryKey"`
	OrderID         uint    `json:"order_id"`
	BookID          uint    `json:"book_id"`
	Book            Book    `json:"book"`
	Quantity        int     `json:"quantity"`
	PriceAtPurchase float64 `json:"price_at_purchase"`
}

package models

import (
	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	database, err := gorm.Open(sqlite.Open("bookstore.db"), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	database.AutoMigrate(&User{}, &Book{}, &Order{}, &OrderItem{})
	DB = database
}

func SeedAdmin() {
	var user User
	if err := DB.Where("email = ?", "admin@bookstore.com").First(&user).Error; err != nil {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		admin := User{
			Email:     "admin@bookstore.com",
			Password:  string(hashedPassword),
			FirstName: "Yaroslav",
			LastName:  "Sereda",
			Role:      "admin",
		}

		DB.Create(&admin)
	}
}

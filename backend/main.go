package main

import (
	"course_work/controllers"
	"course_work/middlewares"
	"course_work/models"

	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	models.ConnectDatabase()
	models.SeedAdmin()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	api := r.Group("/api")
	{
		api.GET("/books", controllers.FindBooks)
		api.GET("/books/:id", controllers.FindBookByID)
		api.GET("/categories", controllers.GetCategories)

		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		admin := api.Group("/books")
		admin.Use(middlewares.JwtAuthMiddleware())
		admin.Use(middlewares.AdminRoleMiddleware())
		{
			admin.POST("/", controllers.CreateBook)
			admin.PUT("/:id", controllers.UpdateBook)
			admin.DELETE("/:id", controllers.DeleteBook)
			admin.POST("/populate", controllers.PopulateBooks)
		}

		orders := api.Group("/orders")
		orders.Use(middlewares.JwtAuthMiddleware())
		{
			orders.POST("", controllers.CreateOrder)
			orders.GET("", controllers.GetMyOrders)
			orders.GET("/:id/pdf", controllers.GenerateOrderPDF)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}

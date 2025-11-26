package controllers

import (
	"course_work/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

func GenerateOrderPDF(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var order models.Order
	if err := models.DB.Preload("Items.Book").First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	if order.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 24)
	pdf.Cell(40, 10, "BookStore Receipt")
	pdf.Ln(12)
	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, fmt.Sprintf("Order ID: #%d", order.ID))
	pdf.Ln(6)
	pdf.Cell(40, 10, fmt.Sprintf("Date: %s", order.CreatedAt.Format("2006-01-02 15:04")))
	pdf.Ln(20)
	pdf.SetFont("Arial", "B", 12)
	pdf.SetFillColor(240, 240, 240)
	pdf.CellFormat(100, 10, "Item", "1", 0, "", true, 0, "")
	pdf.CellFormat(30, 10, "Quantity", "1", 0, "C", true, 0, "")
	pdf.CellFormat(30, 10, "Price", "1", 0, "R", true, 0, "")
	pdf.CellFormat(30, 10, "Total", "1", 1, "R", true, 0, "")
	pdf.SetFont("Arial", "", 12)
	for _, item := range order.Items {
		title := item.Book.Title
		if len(title) > 35 {
			title = title[:32] + "..."
		}

		totalItemPrice := float64(item.Quantity) * item.PriceAtPurchase
		pdf.CellFormat(100, 10, title, "1", 0, "", false, 0, "")
		pdf.CellFormat(30, 10, fmt.Sprintf("%d", item.Quantity), "1", 0, "C", false, 0, "")
		pdf.CellFormat(30, 10, fmt.Sprintf("%.2f", item.PriceAtPurchase), "1", 0, "R", false, 0, "")
		pdf.CellFormat(30, 10, fmt.Sprintf("%.2f", totalItemPrice), "1", 1, "R", false, 0, "")
	}

	pdf.Ln(5)
	pdf.SetFont("Arial", "B", 14)
	pdf.CellFormat(160, 10, "Grand Total:", "", 0, "R", false, 0, "")
	pdf.CellFormat(30, 10, fmt.Sprintf("%.2f UAH", order.TotalAmount), "", 1, "R", false, 0, "")

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=order_%d.pdf", order.ID))
	c.Header("Content-Type", "application/pdf")

	if err := pdf.Output(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
	}
}

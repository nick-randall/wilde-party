package net.untoward;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Book")
public class Book {
	
	@Id
	private long book_id;
	private String title;
	private String author;
	private double price;
//	
	@ManyToOne
    @JoinColumn(name="Publisher", nullable=false)
	private PublishingHouse publishingHouse;
	
	public Book() {}

	public Book(String title, String author, double price) {
		super();
		this.title = title;
		this.author = author;
		this.price = price;
	}

	// Primary key
	@Id
	@Column(name = "book_id")
	// Auto-Increment
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}


}

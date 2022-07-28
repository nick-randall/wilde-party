package net.untoward;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
public class PublishingHouse {

	@Id
	private long publisher_id;

	private String name;

	private String address;

	@OneToMany(targetEntity = Book.class, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Book> books = new ArrayList<>();

	public PublishingHouse() {}

	
	public PublishingHouse(String name, String address, List<Book> books) {
		super();
		this.name = name;
		this.address = address;
	}
	

	public List<Book> getBooks() {
		return books;
	}

	public void setBooks(List<Book> books) {
		this.books = books;
	}

	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

}

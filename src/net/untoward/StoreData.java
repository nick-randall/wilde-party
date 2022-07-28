package net.untoward;


import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.Metadata;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

public class StoreData {
	public static void main(String[] args) {
		StandardServiceRegistry ssr = new StandardServiceRegistryBuilder().configure("hibernate.cfg.xml").build();

		Metadata meta = new MetadataSources(ssr).getMetadataBuilder().build();


		SessionFactory factory = meta.getSessionFactoryBuilder().build();
		Session session = factory.openSession();
		Transaction t = session.beginTransaction();

		List<Book> books = new ArrayList<>();
		Book firstBook = new Book("The Crypt", "Ripley Stein", 1000);
		books.add(firstBook);
		PublishingHouse penguin = new PublishingHouse("Penguin", "32 Penguin Street, London", books);

		session.persist(penguin);
		session.persist(firstBook);
		t.commit();
		System.out.println("successfully saved");
		factory.close();
		session.close();

	}

}

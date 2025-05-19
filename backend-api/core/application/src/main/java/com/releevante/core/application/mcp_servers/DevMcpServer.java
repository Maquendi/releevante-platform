package com.releevante.core.application.mcp_servers;

import com.releevante.types.McpServer;
import com.releevante.types.McpTool;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@McpServer
public class DevMcpServer extends AbstractMcpServer {

  @McpTool(
      name = "sampleBook",
      description = "These are the properties of a book, you can use this to create a new book")
  public Mono<Map<String, String>> getSampleBook(String isbn) {

    Map<String, String> book = new HashMap<>();
    book.put("isbn", "string; random uuid");
    book.put("title", "string; the book title");
    book.put("author", "string; the author name");
    book.put("publisher", "string; random publisher name");
    book.put("publishedDate", "date; random date between 2020 and 2025");
    book.put("description", "string; the book description or random book description");
    book.put("language", "string; the book language");
    book.put("price", "number; random between 10 and 100");
    book.put("stock", "number; random between 10 and 100");
    book.put("image", "string; random image url");
    book.put(
        "tags",
        "array of objects; tag properties: {name: string; (category, subCategory), value: string; (book category like fiction, non-fiction, etc, book sub-category like bestseller, new release, top rated etc)}");
    book.put("bindingType", "string; random binding type");
    book.put("publicIsbn", "string; random uuid");
    book.put("printLength", "number; random between 100 and 1000");
    book.put("publishDate", "date;");
    book.put("dimensions", "string; book dimensions like 10x10x10");
    book.put("qty", "number; random between 10 and 100");

    return Mono.just(book);
  }

  // @McpTool(name = "createBook", description = "Create a book")
  // public Mono<Boolean> createBook(BookDtoV2 book) {

  //   return Mono.just(true);

  // }

}

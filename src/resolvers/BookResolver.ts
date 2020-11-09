import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Book } from "../models/Books";
import { InputType, Field } from "type-graphql";

//Types 
@InputType()
class CreateBookInput {
  @Field()
  title: string;

  @Field()
  author: string;
}

@InputType()
export class UpdateBookInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  isPublished?: boolean;
}

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  books() {
    return Book.find()
  }

  @Mutation(() => Book)
  async createBook(@Arg("data") data: CreateBookInput) {
    const book = Book.create(data);
    await book.save()
    return book;
  }

  @Query(() => Book)
  book(@Arg("id") id: string) {
  return Book.findOne({ where: { id } });
}

@Mutation(() => Book)
async updateBook(@Arg("id") id: string, @Arg("data") data: UpdateBookInput) {
  const book = await Book.findOne({ where: { id } });
  if (!book) throw new Error("Book not found!");
  Object.assign(book, data);
  await book.save();
  return book;
}

@Mutation(() => Boolean)
async deleteBook(@Arg("id") id: string) {
  const book = await Book.findOne({ where: { id } });
  if (!book) throw new Error("Book not found!");
  await book.remove();
  return true;
}
}
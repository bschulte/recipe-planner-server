import { ObjectType, Field, ArgsType, InputType } from "type-graphql";

@InputType()
export class RecipeInput {
  @Field()
  public name: string;

  @Field()
  public url: string;

  @Field()
  public dishType: string;
}

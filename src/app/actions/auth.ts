"use server";
import bcrypt from "bcryptjs";
import { SignupFormSchema, FormState } from "@/lib/definitions";
// import database connector
import { createUser, findUser } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

async function login(previousState: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    console.log("validatedFields", validatedFields);
  }

  // 2. Prepare data for insertion into database
  const { username, password } = validatedFields.data;

  const user = await findUser(username);
  const isValidPassword =
    user && (await bcrypt.compare(password, user.hashedPassword));

  if (!isValidPassword) {
    return {
      message: "Invalid username or password.",
    };
  }

  // 4. Create user session
  await createSession(user.id);
  // 5. Redirect user
  redirect("/routing");
}

async function signup(previousState: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  console.log(
    "validatedFields errors",
    validatedFields?.error?.flatten().fieldErrors
  );

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    console.log("validatedFields", validatedFields);
  }

  // 2. Prepare data for insertion into database
  const { username, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
  const data = await createUser(username, hashedPassword);

  if (!data) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  // 4. Create user session
  await createSession(data.id);
  // 5. Redirect user
  redirect("/routing");
}

async function logout() {
  deleteSession();
  redirect("/login");
}

export { signup, login, logout };

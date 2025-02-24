"use server";

export async function sendContactDetails(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  try {
    const response = await fetch("https://backend.gezeno.in/api/contact-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit contact details");
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
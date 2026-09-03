import { auth } from "../../../../auth";
import { connectToDB } from "../../../../lib/db";
import CustomPlan from "../../../../models/CustomPlan";
import { findPlanNameCollision } from "../../../../lib/customPlansData";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { name, rate, days, min, visibility, userId } = await req.json();

    if (!name?.trim() || rate === undefined || days === undefined || min === undefined) {
      return Response.json({ error: "Fill in name, rate, term, and minimum." }, { status: 400 });
    }
    const numericRate = Number(rate);
    const numericDays = Number(days);
    const numericMin = Number(min);
    if (!(numericRate > 0) || !(numericDays >= 1) || !(numericMin >= 0)) {
      return Response.json({ error: "Rate, term, and minimum must be valid positive numbers." }, { status: 400 });
    }

    const resolvedVisibility = visibility === "public" ? "public" : "private";
    if (resolvedVisibility === "private" && !userId) {
      return Response.json({ error: "Pick which user this private plan is for." }, { status: 400 });
    }

    await connectToDB();

    const collision = await findPlanNameCollision({ name, visibility: resolvedVisibility, userId });
    if (collision) {
      return Response.json({ error: collision }, { status: 409 });
    }

    const plan = await CustomPlan.create({
      name: name.trim(),
      rate: numericRate,
      days: numericDays,
      min: numericMin,
      visibility: resolvedVisibility,
      userId: resolvedVisibility === "private" ? userId : null,
    });

    return Response.json({ ok: true, plan: { id: plan._id } }, { status: 201 });
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message || "Invalid input";
      return Response.json({ error: firstError }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

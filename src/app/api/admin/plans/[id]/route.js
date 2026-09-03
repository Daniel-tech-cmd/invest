import { auth } from "../../../../../auth";
import { connectToDB } from "../../../../../lib/db";
import CustomPlan from "../../../../../models/CustomPlan";
import { findPlanNameCollision } from "../../../../../lib/customPlansData";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in.", status: 401 };
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return { error: "Admin access required.", status: 403 };
  }
  return null;
}

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return Response.json({ error: denied.error }, { status: denied.status });

  try {
    const { id } = await params;
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

    const plan = await CustomPlan.findById(id);
    if (!plan) {
      return Response.json({ error: "Plan not found." }, { status: 404 });
    }

    const collision = await findPlanNameCollision({ name, visibility: resolvedVisibility, userId, excludeId: id });
    if (collision) {
      return Response.json({ error: collision }, { status: 409 });
    }

    plan.name = name.trim();
    plan.rate = numericRate;
    plan.days = numericDays;
    plan.min = numericMin;
    plan.visibility = resolvedVisibility;
    plan.userId = resolvedVisibility === "private" ? userId : null;
    await plan.save();

    return Response.json({ ok: true });
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message || "Invalid input";
      return Response.json({ error: firstError }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return Response.json({ error: denied.error }, { status: denied.status });

  try {
    const { id } = await params;

    await connectToDB();
    const deleted = await CustomPlan.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: "Plan not found." }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

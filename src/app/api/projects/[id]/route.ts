import { NextResponse } from 'next/server';
import { updateProject, deleteProject } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const project = await updateProject(Number(id), body);
  return NextResponse.json(project);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteProject(Number(id));
  return NextResponse.json({ ok: true });
}

import type { Role } from "@/lib/types";

const RANK: Record<Role, number> = { viewer: 0, contributor: 1, editor: 2, admin: 3 };

export function roleAtLeast(role: Role | null | undefined, min: Role) {
  return !!role && RANK[role] >= RANK[min];
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  editor: "Redaktor",
  contributor: "Kontribues",
  viewer: "Pa qasje",
};

export const ROLE_HELP: Record<Role, string> = {
  admin: "Qasje e plotë, përfshirë menaxhimin e përdoruesve.",
  editor: "Krijon, publikon dhe fshin çdo përmbajtje.",
  contributor: "Shkruan lajme si draft dhe ngarkon foto; nuk publikon.",
  viewer: "Llogari pa qasje në panel derisa një administrator t'i japë rol.",
};

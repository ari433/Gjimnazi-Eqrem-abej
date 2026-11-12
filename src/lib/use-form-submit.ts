"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React 19 resets uncontrolled fields after a <form action> completes, which
 * would wipe what someone typed when the server returns a validation error.
 * Submitting through onSubmit keeps the fields intact.
 */
export function submitWithoutReset(formAction: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteProject() {
    const confirmed = window.confirm(
      "Delete this project? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete project");
        return;
      }

      router.refresh();
    } catch {
      alert("Failed to delete project");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteProject}
      disabled={deleting}
      className="btn-danger"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}

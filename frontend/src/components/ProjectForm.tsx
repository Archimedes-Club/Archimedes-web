// components/ProjectForm.tsx
import React, { useState, useEffect } from "react";
import { ProjectExtended } from "../types/extendedProject.types";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: ProjectExtended;
  onSubmit: (project: ProjectExtended) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  userName: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  userName,
}) => {
  const [formData, setFormData] = useState<ProjectExtended>({
    id: 0,
    title: "",
    description: "",
    status: "",
    category: "",
    team_lead: userName,
    team_size: 1,
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "team_size" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.status ||
      !formData.category
    ) {
      alert("Please fill all required fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Project Title</label>
      <input
        type="text"
        id="title"
        value={formData.title}
        onChange={handleChange}
        className="input-field"
        disabled={isSubmitting}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={formData.description}
        onChange={handleChange}
        className="input-field"
        disabled={isSubmitting}
      />

      <label htmlFor="team_size">Team Size</label>
      <input
        type="number"
        id="team_size"
        value={formData.team_size}
        onChange={handleChange}
        className="input-field"
        disabled={isSubmitting}
      />

      <label htmlFor="status">Status</label>
      <select
        id="status"
        value={formData.status}
        onChange={handleChange}
        className="input-field"
        disabled={isSubmitting}
      >
        <option value="">Select Project Status</option>
        <option value="Deployed">Deployed</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Hiring">Hiring</option>
      </select>

      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={formData.category}
        onChange={handleChange}
        className="input-field"
        disabled={isSubmitting}
      >
        <option value="">Select Project Category</option>
        <option value="Web">Web</option>
        <option value="Research">Research</option>
        <option value="AI/ML">AI/ML</option>
        <option value="IoT">IoT</option>
      </select>

      <label htmlFor="team_lead">Team Lead</label>
      <input
        type="text"
        id="team_lead"
        value={formData.team_lead}
        onChange={handleChange}
        className="input-field"
        disabled={isSubmitting}
      />

      <div className="form-buttons">
        <button type="submit" className="create-btn" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..."
            : mode === "edit"
            ? "Update Project"
            : "Create Project"}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;

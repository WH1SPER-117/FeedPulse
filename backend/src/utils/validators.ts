export const validateFeedback = (data: any) => {
  const { title, description, category } = data;

  if (!title || title.length > 120) {
    return "Invalid title";
  }

  if (!description || description.length < 20) {
    return "Description must be at least 20 characters";
  }

  const validCategories = ["Bug", "Feature Request", "Improvement", "Other"];
  if (!validCategories.includes(category)) {
    return "Invalid category";
  }

  return null;
};
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../redux/tasksSlice";

const TaskAdd = ({ isOpen, onClose, groupContext }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const tasks = useSelector((state) => state.tasks.data);

  const statuses = ['Todo', 'Done', 'Backlog', 'In progress', 'Cancelled'];
  const priorities = [
    { label: "Urgent", value: 4 },
    { label: "High", value: 3 },
    { label: "Medium", value: 2 },
    { label: "Low", value: 1 },
    { label: "No Priority", value: 0 },
  ];

  const [form, setForm] = useState({
    title: "",
    userId: "",
    status: "",
    priority: "",
    tag: "",
  });

  useEffect(() => {
    if (groupContext) {
      console.log("groupContext", groupContext);
      setForm((prevForm) => ({
        ...prevForm,
        [groupContext.key]: groupContext.value,
      }));
    }
  }, [groupContext]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitting form", form);
    if (!form.title || !form.userId || !form.status || form.priority === "" || !form.tags) {
      alert("Please fill all fields");
      return;
    }

    const newTicket = {
      id: `CAM-${tasks.length + 2}`, // get Next ID
      ...form,
      priority: Number(form.priority),
      tag: form.tags.split(",").map((tag) => tag.trim()), // add tags by converting to array
    };
    dispatch(addTask(newTicket));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popupoverlay" onClick={onClose}>
      <div className="popupcontent" onClick={(e) => e.stopPropagation()}>
        <h2>Add Task</h2>
        <form>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>User</label>
            <select
              name="userId"
              value={form.userId}
              onChange={handleFormChange}
              className="form-input"
            >
              <option value="">Choose</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              name="tag"
              value={form.tags}
              onChange={handleFormChange}
              className="form-input"
              placeholder="Enter Tags (, separated)"
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleFormChange}
              className="form-input"
            >
              <option value="">Choose</option>
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleFormChange}
              className="form-input"
            >
              <option value="">Choose</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="submitbtn" style={{float:'right'}} onClick={handleSubmit}>
            Add
          </button>

        </form>
      </div>
    </div>
  );
};

export default TaskAdd;

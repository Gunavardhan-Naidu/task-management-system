"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import Button from "../Button/Button";
import { add } from "@/app/utils/Icons";
import { useAuth } from "@/app/providers/Sessionprovider";

interface Props {
  task: {
    id: string;
    title: string;
    description: string;
    date: string;
    is_completed: boolean;
    is_important: boolean;
  };
  onClose?: () => void;
}

function EditContent({ task, onClose }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState(new Date(task.date).toISOString().split('T')[0]);
  const [completed, setCompleted] = useState(task.is_completed);
  const [important, setImportant] = useState(task.is_important);

  const { theme, allTasks, closeModal } = useGlobalState();
  const { token } = useAuth();

  const handleChange = (name: string) => (e: any) => {
    switch (name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "date":
        setDate(e.target.value);
        break;
      case "completed":
        setCompleted(e.target.checked);
        break;
      case "important":
        setImportant(e.target.checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const updatedTask = {
      title,
      description,
      date: new Date(date).toISOString(),
      is_completed: completed,
      is_important: important
    };

    try {
      const res = await axios.put(`/api/tasks/${task.id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success("Task updated successfully.");
        allTasks();
        closeModal();
        if (onClose) onClose();
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  return (
    <EditContentStyled onSubmit={handleSubmit} theme={theme}>
      <h1>Edit Task</h1>
      <div className="input-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          name="title"
          onChange={handleChange("title")}
          placeholder="e.g, Watch a video from Fireship."
        />
      </div>
      <div className="input-control">
        <label htmlFor="description">Description</label>
        <textarea
          value={description}
          onChange={handleChange("description")}
          name="description"
          id="description"
          rows={4}
          placeholder="e.g, Watch a video about Next.js Auth"
        ></textarea>
      </div>
      <div className="input-control">
        <label htmlFor="date">Date</label>
        <input
          value={date}
          onChange={handleChange("date")}
          type="date"
          name="date"
          id="date"
        />
      </div>
      <div className="input-control toggler">
        <label htmlFor="completed">Toggle Completed</label>
        <input
          checked={completed}
          onChange={handleChange("completed")}
          type="checkbox"
          name="completed"
          id="completed"
        />
      </div>
      <div className="input-control toggler">
        <label htmlFor="important">Toggle Important</label>
        <input
          checked={important}
          onChange={handleChange("important")}
          type="checkbox"
          name="important"
          id="important"
        />
      </div>

      <div className="submit-btn flex justify-end">
        <Button
          type="submit"
          name="Update Task"
          icon={add}
          padding={"0.8rem 2rem"}
          borderRad={"0.8rem"}
          fw={"500"}
          fs={"1.2rem"}
          background={"rgb(0, 163, 255)"}
        />
      </div>
    </EditContentStyled>
  );
}

const EditContentStyled = styled.form`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${(props) => props.theme.colorGrey1};

  .input-control {
    position: relative;
    margin: 1.6rem 0;
    font-weight: 500;

    @media screen and (max-width: 450px) {
      margin: 1rem 0;
    }

    label {
      margin-bottom: 0.5rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${(props) => props.theme.colorGrey3};
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 1rem;

      resize: none;
      background-color: ${(props) => props.theme.colorGreyDark};
      color: ${(props) => props.theme.colorGrey2};
      border-radius: 0.5rem;
    }
  }

  .submit-btn button {
    transition: all 0.35s ease-in-out;

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6rem 1rem !important;

      i {
        font-size: 1.2rem !important;
        margin-right: 0.5rem !important;
      }
    }

    i {
      color: ${(props) => props.theme.colorGrey0};
    }

    &:hover {
      background: ${(props) => props.theme.colorPrimaryGreen} !important;
      color: ${(props) => props.theme.colorWhite} !important;
    }
  }

  .toggler {
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;

    label {
      flex: 1;
    }

    input {
      width: initial;
    }
  }
`;

export default EditContent; 
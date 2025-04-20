"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import { edit, trash } from "@/app/utils/Icons";
import React from "react";
import styled from "styled-components";
import formatDate from "@/app/utils/formatDate.js";
import Modal from "../Modals/Modal";
import EditContent from "../Modals/EditContent";

interface Props {
  title: string;
  description: string;
  date: string;
  is_completed: boolean;
  is_important: boolean;
  id: string;
}

function TaskItem({ title, description, date, is_completed, is_important, id }: Props) {
  const { theme, deleteTask, updateTask, openModal, modal } = useGlobalState();
  const [showEditModal, setShowEditModal] = React.useState(false);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <>
      {showEditModal && (
        <Modal content={<EditContent 
          task={{ id, title, description, date, is_completed, is_important }} 
          onClose={handleCloseEditModal}
        />} />
      )}
      <TaskItemStyled theme={theme} $isImportant={is_important}>
        <h1>
          {title}
          {is_important && <span className="important-badge">Important</span>}
        </h1>
        <p>{description}</p>
        <p className="date">{formatDate(date)}</p>
        <div className="task-footer">
          {is_completed ? (
            <button
              className="completed"
              onClick={() => {
                const task = {
                  id,
                  is_completed: !is_completed,
                  is_important: is_important
                };

                updateTask(task);
              }}
            >
              Completed
            </button>
          ) : (
            <button
              className="incomplete"
              onClick={() => {
                const task = {
                  id,
                  is_completed: !is_completed,
                  is_important: is_important
                };

                updateTask(task);
              }}
            >
              Incomplete
            </button>
          )}
          <button 
            className="edit"
            onClick={handleEditClick}
          >
            {edit}
          </button>
          <button
            className="delete"
            onClick={() => {
              deleteTask(id);
            }}
          >
            {trash}
          </button>
        </div>
      </TaskItemStyled>
    </>
  );
}

const TaskItemStyled = styled.div<{ $isImportant: boolean }>`
  padding: 1.2rem 1rem;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.borderColor2};
  box-shadow: ${(props) => props.theme.shadow7};
  border: 2px solid ${(props) => props.$isImportant ? props.theme.colorPrimary : props.theme.borderColor2};

  height: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .date {
    margin-top: auto;
  }

  > h1 {
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .important-badge {
      font-size: 0.8rem;
      padding: 0.2rem 0.5rem;
      background-color: ${(props) => props.theme.colorPrimary};
      color: white;
      border-radius: 0.5rem;
    }
  }

  .task-footer {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    button {
      border: none;
      outline: none;
      cursor: pointer;

      i {
        font-size: 1.4rem;
        color: ${(props) => props.theme.colorGrey2};
      }
    }

    .edit {
      margin-left: auto;
    }

    .completed,
    .incomplete {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: ${(props) => props.theme.colorDanger};
      border-radius: 30px;
    }

    .completed {
      background: ${(props) => props.theme.colorGreenDark} !important;
    }
  }
`;

export default TaskItem;
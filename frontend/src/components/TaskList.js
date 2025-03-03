import React from 'react';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
    return (
        <div className="task-list">
            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task.id} className="task-item">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <button onClick={() => onUpdateTask(task.id, { ...task, title: 'Updated Title' })}>
                            Update
                        </button>
                        <button onClick={() => onDeleteTask(task.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default TaskList;
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setGroupBy, setSortBy } from '../redux/filtersSlice';
import TaskAdd from './TaskAdd'; // Import the popup component

const MainComponent = () => {
  const dispatch = useDispatch(); // Use dispatch

  const tasks = useSelector((state) => state.tasks.data);
  const users = useSelector((state) => state.users.data);
  const groupBy = useSelector((state) => state.filters.groupBy);
  const sortBy = useSelector((state) => state.filters.sortBy);

  const statuses = ['Todo', 'In progress', 'Done', 'Backlog', 'Cancelled'];


  const [showAddpopup, setShowAddpopup] = useState(false);
  const [getExistingText, setGetExistingText] = useState("");

  const openAddpopup = (existingText) => {
    setShowAddpopup(true);
    setGetExistingText(existingText);
  }

  const closeAddpopup = () => {
    setShowAddpopup(false);
    setGetExistingText("");
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 4:
        return 'Urgent';
      case 3:
        return 'High';
      case 2:
        return 'Medium';
      case 1:
        return 'Low';
      case 0:
        return 'No priority';
      default:
        return 'Unknown';
    }
  };

  const groupTasks = (tasks, groupBy) => {
    return tasks.reduce((groups, task) => {
      const group = task[groupBy] || 'Uncategorized';

      if (groupBy === 'priority') {
        const priorityGroup = task.priority !== undefined ? task.priority : 'No Priority';
        if (!groups[priorityGroup]) {
          groups[priorityGroup] = [];
        }
        groups[priorityGroup].push(task);
      } else {
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(task);
      }

      return groups;
    }, {});
  };

  const sortTasks = (tasks, sortBy) => {
    return tasks.sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priority - a.priority;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const groupedTasks = groupTasks(tasks, groupBy);

  const groupedWithStatuses = statuses.map((status) => ({
    group: status,
    groupId: status,
    tasks: sortTasks(groupedTasks[status] || [], sortBy),
  }));

  const groupedWithUsers = users.map((user) => ({
    group: user.name,
    groupId: user.id,
    tasks: sortTasks(groupedTasks[user.id] || [], sortBy),
  }));

  const groupedWithPriority = [4, 3, 2, 1, 0].map((priority) => ({
    group: getPriorityLabel(priority),
    groupId: priority,
    tasks: sortTasks(groupedTasks[priority] || [], sortBy),
  }));

  const renderGroupedTasks = () => {
    if (groupBy === 'status') {
      return groupedWithStatuses;
    } else if (groupBy === 'userId') {
      return groupedWithUsers;
    } else if (groupBy === 'priority') {
      return groupedWithPriority;
    }
    return [];
  };

  const [showPopfilter, setShowPopfilter] = useState(false);
  const popfilterRef = useRef(null); 

  const handleDisplayClick = () => {
    setShowPopfilter(!showPopfilter);
  };

  const handleClickOutside = (event) => {
    if (popfilterRef.current && !popfilterRef.current.contains(event.target)) {
      setShowPopfilter(false);
    }
  };

  useEffect(() => {
    if (showPopfilter) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopfilter]);

  return (
    <div className="mainboard">
      {/* Filters section with Display button */}
      <div className="filters">
        <button onClick={handleDisplayClick} style={{ display: 'flex', alignItems: 'center',fontSize:'1rem' }} className="btnbtn">
          <img
            alt="icon"
            style={{
              marginRight: '0.6rem',
              width: '0.9rem',
              height: '0.9rem',
              display: 'inline-block',
            }}
            src={`assets/display.svg`}
          /> Display
          <img
            alt="icon"

            style={{
              marginLeft: '0.2rem',
              width: '0.9rem',
              height: '0.9rem',
              display: 'inline-block',
            }}
            src={`assets/down.svg`}
          />
        </button>

        {showPopfilter && (
          <div className="popfilter" ref={popfilterRef}>
            <div className='flex width12rem' style={{marginBottom:'15px'}}>
              <span className='textGray bold' style={{ fontSize: '1rem' }}>Grouping </span>
              <select onChange={(e) => dispatch(setGroupBy(e.target.value))} value={groupBy}>
                <option value="status">Status</option>
                <option value="userId">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className='flex width12rem'>
              <span className='textGray bold' style={{ fontSize: '1rem' }}>Priority </span>
              <select onChange={(e) => dispatch(setSortBy(e.target.value))} value={sortBy}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>

          </div>
        )}
      </div>

      {/* Kanban board columns */}
      <div className="maincolumns">
        {renderGroupedTasks().map((group, index) => (
          <div key={index} className="maincolumn">
            <div className="flex">
              {groupBy === 'userId' ? (
                <h3 style={{ textAlign: 'left' }}>
                  <img
                    style={{
                      marginRight: '0.6rem',
                      width: '1.5rem',
                      height: '1.5rem',
                      marginBottom: '-0.4rem',
                      display: 'inline-block',
                      borderRadius: '50%',
                    }}
                    src={`assets/user.png`}
                    alt={group.group}
                  />
                  {group.group}
                  <span className="textGray" style={{ marginLeft: '0.6rem' }}>
                    {group.tasks.length}
                  </span>
                </h3>
              ) : (
                <h3 style={{ textAlign: 'left' }}>
                  <img
                    className='mright06rem'
                    src={`assets/${group.group}.svg`}
                    alt={group.group}
                  />
                  {group.group}
                  <span className="textGray mleft06rem">
                    {group.tasks.length}
                  </span>
                </h3>
              )}

              <div>
                <h3>
                  <img onClick={() => openAddpopup(group.groupId)} style={{ cursor: 'pointer' }} className="mright06rem" src={`assets/add.svg`} alt="Add Target" />
                  <img className="mright06rem" src={`assets/3DotMenu.svg`} alt="Menu" />
                </h3>
              </div>
            </div>

            {group.tasks.length > 0 ? (
              group.tasks.map((task) => (
                <div key={task.id} className="maincard">
                  <div className="flex">
                    <h4 className="textGray">{task.id}</h4>
                    {groupBy !== "userId" && (
                      <img
                        style={{
                          marginRight: '0.6rem',
                          width: '1rem',
                          height: '1rem',
                          marginBottom: '-0.4rem',
                          display: 'inline-block',
                          borderRadius: '50%',
                        }}
                        src={`assets/user.png`}
                        alt={group.group}
                      />
                    )}
                  </div>
                  <div style={{ maxWidth: '92%', display: 'flex' }}>
                    {groupBy !== "status" && (

                      <img
                        style={{ height: '0.84rem', width: '0.84rem', marginTop: '0.2rem', marginRight: '0.4rem' }}
                        src={`assets/${task.status}.svg`}
                        alt={task.status}
                      />
                    )}

                    <h4 className="truncate" style={{ textAlign: 'left' }}>
                      {task.title}
                    </h4>
                  </div>
                  <div className="flex">
                    <div className="flex" style={{ marginTop: '0.6rem' }}>
                      {groupBy !== "priority" && (

                        <div className="priority flex" style={{ marginRight: '0.6rem' }}>
                          <img
                            style={{ height: '1.0rem', width: '1.0rem' }}
                            src={`assets/${getPriorityLabel(task.priority)}.svg`}
                            alt={getPriorityLabel(task.priority)}
                          />
                        </div>
                      )}
                      {task.tag && task.tag.length > 0 && task.tag.map((tag, index) => (

                        <div className="tags" key={index} style={{ marginRight: '10px' }}>
                          <span key={index} className="tag flex">
                            <span className="greycircle"></span> {tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="maincard center">
                <p>No tasks available</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {showAddpopup && <TaskAdd
        isOpen={showAddpopup}
        onClose={closeAddpopup}
        groupContext={{ key: groupBy, value: getExistingText }}
      />
      }

    </div>
  );
};

export default MainComponent;

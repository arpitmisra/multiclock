import { useState, useEffect, useRef } from "react";
import "./App.css";
import Stopwatch from "./Stopwatch";

interface Alarm {
  id: number;
  time: string;
  isRinging: boolean;
}

function AlarmApp() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [audio] = useState(new Audio("alarm.wav"));
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    audio.load();
  }, [audio]);

  useEffect(() => {
    alarms.forEach((alarm) => {
      if (
        alarm.time &&
        currentTime.toLocaleTimeString("en-US", { hour12: false }) === alarm.time
      ) {
        triggerAlarm(alarm.id);
      }
    });
  }, [currentTime, alarms]);

  const addAlarm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAlarmTime = event.target.value;
    if (!newAlarmTime) return;

    const newAlarm: Alarm = {
      id: Date.now(),
      time: newAlarmTime,
      isRinging: false,
    };

    setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
  };

  const deleteAlarm = (id: number) => {
    stopAlarm(id);
    setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm.id !== id));
  };

  const triggerAlarm = (id: number) => {
    startRepeatingAlarm();
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isRinging: true } : alarm
      )
    );
  };

  const stopAlarm = (id: number) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isRinging: false } : alarm
      )
    );
    stopRepeatingAlarm();
  };

  const startRepeatingAlarm = () => {
    if (alarmIntervalRef.current) return;
    alarmIntervalRef.current = setInterval(() => {
      audio.currentTime = 0;
      audio.play().catch((err) => console.error("Audio playback error:", err));
    }, 9000);
  };

  const stopRepeatingAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div
      className={`app-container ${
        alarms.some((alarm) => alarm.isRinging) ? "ringing" : ""
      }`}
    >
      <h1 className="app-title">Multi-Alarm Clock</h1>
      <div className="alarm-input">
        <label htmlFor="alarm">Add Alarm (HH:MM:SS): </label>
        <input id="alarm" type="time" step="1" onChange={addAlarm} />
      </div>
      <h2 className="current-time">Current Time: {currentTime.toLocaleTimeString()}</h2>
      <div className="alarms-list">
        {alarms.map((alarm) => (
          <div key={alarm.id} className={`alarm-card ${alarm.isRinging ? "ringing" : ""}`}>
            <span>
              Alarm Set For: {alarm.time}{" "}
              {alarm.isRinging && <strong> - RINGING!!!</strong>}
            </span>
            <div className="alarm-buttons">
              <button className="delete-button" onClick={() => deleteAlarm(alarm.id)}>
                Delete
              </button>
              {alarm.isRinging && (
                <button className="stop-button" onClick={() => stopAlarm(alarm.id)}>
                  Stop Alarm
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Stopwatch />
    </div>
  );
}

export default AlarmApp;

import { useState, useCallback } from 'react';

const useAlerts = (maxAlerts = 5) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback(
    (message, type, duration = 3500, onRemove) => {
      const newAlert = {
        text: message,
        type,
        timestamp: Date.now(),
        duration: duration,
      };
      setAlerts(prev => {
        let updatedAlerts;
        if (prev.length >= maxAlerts) {
          updatedAlerts = [...prev.slice(1), newAlert];
        } else {
          updatedAlerts = [...prev, newAlert];
        }
        if (duration === Infinity) {
          return updatedAlerts;
        }
        // Automatically remove the alert after the duration
        setTimeout(() => {
          setAlerts(currentAlerts => {
            const filteredAlerts = currentAlerts.filter(
              alert => alert.timestamp !== newAlert.timestamp
            );
            // Call the callback if provided when an alert is removed
            if (onRemove) {
              onRemove();
            }
            return filteredAlerts;
          });
        }, duration);

        return updatedAlerts;
      });
    },
    [maxAlerts]
  );

  // Function to remove a specific alert based on its timestamp
  const removeAlert = useCallback((timestamp, onRemove) => {
    setAlerts(prevAlerts => {
      const filteredAlerts = prevAlerts.filter(
        alert => alert.timestamp !== timestamp
      );
      if (onRemove) {
        onRemove();
      }
      return filteredAlerts;
    });
  }, []);

  return {
    alerts,
    addAlert,
    removeAlert,
  };
};

const Alert = ({ message, type }) => {
  const colorVariants = {
    error: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <div
      className={`${colorVariants[type]} px-4 py-3 rounded m-3 relative w-fit ml-auto mr-0`}
      role="alert"
    >
      <strong className="block sm:inline">{message}</strong>
    </div>
  );
};

const AlertContainer = ({ alerts }) => {
  return (
    <div className="absolute top-0 right-0 p-5 space-y-2 z-10">
      {alerts.map(alert => (
        <div
          key={alert.timestamp}
          className={alert.duration !== Infinity ? 'animate-fadeOut' : ''}
          style={{
            animationDuration: `${alert.duration}ms`,
          }}
        >
          <Alert message={alert.text} type={alert.type} />
        </div>
      ))}
    </div>
  );
};

export { useAlerts, AlertContainer };

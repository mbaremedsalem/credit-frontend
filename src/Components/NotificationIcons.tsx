import React, { useState, useRef, useEffect } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { NotificationType } from '../Services/Notifications/type';
import { useLuNotifications } from '../Services/Notifications/LuNotification';
import AuthService from '../Auth-Services/AuthService';
import SpinnerLoader from '../Ui/Spinner';

type Props = {
  notifications: NotificationType[];
};

const NotificationIcon: React.FC<Props> = ({ notifications }) => {
  const UserIdConnect = AuthService.getIDUserConnect()
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false); 
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const readNotifications = notifications.filter(not => not.lu === true);
  const { mutate: luNotifications, isPending: isPendingNotifications } = useLuNotifications();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);

    if (!isRead) {
      setIsRead(true); 
    }

    if (!hasMarkedAsRead && !isRead) {
      luNotifications({ userid:  UserIdConnect!}); 
      setHasMarkedAsRead(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 if(isPendingNotifications){
  return <SpinnerLoader/>
 }

  return (
    <div className="relative" ref={notificationRef}>
      <div onClick={toggleDropdown} className="cursor-pointer relative">
        <IoMdNotifications size={30} className="text-gray-700 hover:text-black transition" />
        { notifications.length > 0 &&readNotifications.length === 0  && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 h-5 min-w-[20px] flex items-center justify-center shadow-md">
            {notifications.length > 99 ? '99+' : notifications.length}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 max-h-[400px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune notification</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="text-sm font-medium text-gray-800">{notif.objet}</p>
                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{notif.message}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(notif.date_created).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

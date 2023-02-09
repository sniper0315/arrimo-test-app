import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Input, message, Modal } from 'antd';

import { CloseOutlined, UserOutlined } from '@ant-design/icons';

import styles from '@/styles/Navbar.module.css';

const Calendar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [calendarApi, setCalendarApi] = useState(null);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const createEventId = () => {
        let eventId = window.localStorage.getItem('calendar_eventId');

        if (!eventId) {
            eventId = 0;
            window.localStorage.setItem('calendar_eventId', eventId);
        } else eventId++;

        return String(eventId);
    };

    const handleAcceptEvent = async () => {
        if (eventTitle === '') {
            messageApi.error('Please input event title.');

            return;
        }

        calendarApi.unselect();
        calendarApi.addEvent({
            id: createEventId(),
            title: eventTitle,
            start: selectedInfo.startStr,
            end: selectedInfo.endStr,
            allDay: selectedInfo.allDay
        });
        await axios
            .post('/api/calendar', {
                title: eventTitle,
                start: selectedInfo.startStr,
                end: selectedInfo.endStr
            })
            .then((res) => {
                messageApi.success(res.data.message);
                setModalOpen(false);
            })
            .catch((err) => {
                messageApi.error(err.response.data.message);
            });
    };

    const handleDateSelect = (selectInfo) => {
        setEventTitle('');
        setModalOpen(true);
        setCalendarApi(selectInfo.view.calendar);
        setSelectedInfo(selectInfo);
    };

    useEffect(async () => {
        await axios
            .get('/api/calendar')
            .then((res) => {
                setUserEvents(res.data);
            })
            .catch((err) => {
                messageApi.error(err.response.data.message);

                if (err.response.status === 405) router.push('/');
            });
    }, []);

    console.log(eventTitle, selectedInfo);

    return (
        <div className={styles.calendarPage}>
            {contextHolder}
            <Head>
                <title>Calendar - User Events</title>
            </Head>
            <div className={styles.calendarContainer}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    select={handleDateSelect}
                    eventContent={renderEventContent}
                    events={userEvents}
                />
                <Modal
                    title="Add User Event"
                    centered
                    open={modalOpen}
                    onOk={handleAcceptEvent}
                    onCancel={() => setModalOpen(false)}
                    okText="Add"
                    width="348px"
                    closeIcon={<CloseOutlined className={styles.icons} />}
                >
                    <div className={styles.eventAddPanel}>
                        <Input placeholder="User Event" prefix={<UserOutlined className={styles.icons} />} value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                    </div>
                </Modal>
            </div>
        </div>
    );
};

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

export default Calendar;

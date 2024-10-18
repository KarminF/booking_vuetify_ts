<template>
  <h3 style="text-align: center">Booking Calendar for: {{ deviceName }}</h3>
  <v-divider></v-divider>

  <v-dialog v-model="addEventDialog" width="auto">
    <v-sheet class="mx-auto" width="300">
      <v-card-title>
        <span class="headline">New Event</span>
      </v-card-title>
      <v-form @submit.prevent="submitAddEvent">
        <v-text-field v-model="currentEvent.title" label="title"></v-text-field>
        <v-textarea v-model="currentEvent.desc" label="description"></v-textarea>
        <!-- <v-date-picker v-model="currentEvent.start" label="Start Date" required></v-date-picker>
        <v-date-picker v-model="currentEvent.end" label="End Date" required></v-date-picker> -->
        <v-switch v-model="currentEvent.allDay" label="All Day Event?"></v-switch>
        <v-btn class="mt-1" type="submit" block>Submit</v-btn>
        <v-btn class="mt-1" @click="addEventDialog = false" block>Cancel</v-btn>
      </v-form>
    </v-sheet>
  </v-dialog>

  <v-dialog v-model="editEventDialog" width="auto">
    <v-sheet class="mx-auto" width="300">
      <v-card-title>
        <span class="headline">Edit Event</span>
      </v-card-title>
      <v-form @submit.prevent="submitEditEvent">
        <v-text-field v-model="currentEvent.title" label="title"></v-text-field>
        <v-textarea v-model="currentEvent.desc" label="description"></v-textarea>
        <!-- <v-date-picker v-model="currentEvent.start" label="Start Date" required></v-date-picker>
        <v-date-picker v-model="currentEvent.end" label="End Date" required></v-date-picker> -->
        <v-switch v-model="currentEvent.allDay" label="All Day Event?"></v-switch>
        <v-btn class="mt-1" type="submit" block>Submit</v-btn>
        <v-btn class="mt-1" @click="deleteEvent" block>Delete</v-btn>
        <v-btn class="mt-1" @click="editEventDialog = false" block>Cancel</v-btn>
      </v-form>
    </v-sheet>
  </v-dialog>

  <FullCalendar ref="fullCalendar" class="calendar" :options="calendarOptions">
    <template v-slot:eventContent="arg">
      <b>{{ arg.timeText }}</b>
      <i>{{ arg.event.title }}</i>
    </template>
  </FullCalendar>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventApi, EventInput } from "@fullcalendar/common";

interface CurrentEvent extends EventInput {
  desc?: string;
}

export default defineComponent({
  props: {
    deviceName: {
      type: String,
      required: true,
    },
  },
  components: {
    FullCalendar,
  },
  setup(props) {
    console.log("props", props);
    const addEventDialog = ref(false);
    const editEventDialog = ref(false);
    const fullCalendar = ref(null);
    const calendarApi = ref(null);
    const currentEvent = reactive<CurrentEvent>({
      title: "",
      desc: "",
      start: null,
      end: null,
      allDay: false,
    });
    const currentEvents = ref([]);
    const rules = {
      required: (value: string | boolean) => !!value || "Required.",
    };
    onMounted(() => {
      if (fullCalendar.value) {
        calendarApi.value = fullCalendar.value.getApi();
      }
    })
    const calendarOptions = reactive({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      initialView: "timeGridWeek",
      initialEvents: [
        {
          id: "1",
          title: "All-day event",
          start: new Date().toISOString().replace(/T.*$/, ""),
        },
        {
          id: "2",
          title: "Timed event",
          start: new Date().toISOString().replace(/T.*$/, "") + "T12:00:00",
        },
      ],
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      eventResizableFromStart: true,
      select: handleDateSelect,
      eventClick: handleEventClick,
      eventsSet: handleEvents,
      eventAdd: handleEventAdd,
      eventRemove: handleEventRemove,
      eventDrop: handleEventDrop,
      eventResize: handleEventResize,
    });

    function submitAddEvent(): void {
      addEventDialog.value = false;
      calendarApi.value.addEvent({
        id: (calendarApi.value.getEvents().length + 1).toString(),
        title: currentEvent.title,
        start: currentEvent.start,
        end: currentEvent.end,
        allDay: currentEvent.allDay,
        extendedProps: {
          description: currentEvent.desc,
        },
      });
    }

    function submitEditEvent(): void {
      editEventDialog.value = false;
      const event = calendarApi.value.getEventById(currentEvent.id);
      event.setProp("title", currentEvent.title);
      event.setExtendedProp("description", currentEvent.desc);
      event.setAllDay(currentEvent.allDay);
      handleEventChange({ event: event });
    }

    function deleteEvent(): void {
      if (!confirm("Are you sure you want to delete this event?")) return;
      editEventDialog.value = false;
      calendarApi.value.getEventById(currentEvent.id).remove();
      Object.assign(currentEvent, {
        title: "",
        desc: "",
        start: null,
        end: null,
        allDay: false,
      });
    }

    function handleDateSelect(selectInfo: any): void {
      currentEvent.start = selectInfo.startStr;
      currentEvent.end = selectInfo.endStr;
      addEventDialog.value = true;
    }

    function handleEventClick(clickInfo: any): void {
      Object.assign(currentEvent, {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        desc: clickInfo.event.extendedProps.description,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        allDay: clickInfo.event.allDay,
      });
      editEventDialog.value = true;
    }

    function handleEventDrop(event: { event: EventApi }): void {
      console.log("dropped:", event.event);
      handleEventChange(event);
    }

    function handleEventResize(event: { event: EventApi }): void {
      console.log("resized:", event.event);
      handleEventChange(event);
    }

    function handleEvents(events: EventApi[]): void {
      currentEvents.value = events;
      console.log("handleEvents");
    }

    function handleEventAdd(event: { event: EventApi }): void {
      console.log("adding to database:", event.event);
    }

    function handleEventChange(event: { event: EventApi }): void {
      console.log("changing in database:", event.event);
    }

    function handleEventRemove(event: { event: EventApi }): void {
      console.log("removing from database:", event.event);
    }

    return {
      ...toRefs({
        fullCalendar,
        deviceName: props.deviceName,
        addEventDialog,
        editEventDialog,
        currentEvent,
        currentEvents,
        rules,
        calendarOptions,
        submitAddEvent,
        submitEditEvent,
        deleteEvent,
        handleDateSelect,
        handleEventClick,
        handleEventDrop,
        handleEventResize,
        handleEvents,
        handleEventAdd,
        handleEventChange,
        handleEventRemove,
      }),
    };
  },
});
</script>

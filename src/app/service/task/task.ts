import { Injectable, Signal, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class Task {
  // Pass the array as an argument to the signal() function
  constructor(){
    this.checkName()
  }
async checkName() {
  const { value } = await Preferences.get({ key: 'task' }) || {};
  if (value) {
    this.taskData.set(JSON.parse(value))
  }
}

  taskData = signal([
    {
      task: 'Study lesson',
      taskDetail: '98',
      category: { cat: 'document-text-outline', color: 'secondary' },
      date: Date.now(),
      time: null,
      isCompleted: false
    },
    {
      task: 'Run 5k',
      taskDetail: '98',
      category: { cat: 'trophy-outline', color: 'tertiary' },
      date: Date.now(),
      time: null,
      isCompleted: false
    },
    {
      task: 'Go to party',
      taskDetail: '98',
      category: { cat: 'calendar-outline', color: 'warning' },
      date: Date.now(),
      time: null,
      isCompleted: false
    },
    {
      task: 'Go to Home',
      taskDetail: '98',
      category: { cat: 'calendar-outline', color: 'success' },
      date: Date.now(),
      time: Date.now(),
      isCompleted: true
    },
  ]);
}

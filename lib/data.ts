export interface Comment {
  id: string;
  user: string;
  rating?: number;
  text: string;
  date: string;
  developerReply?: string;
  isBugReport?: boolean;
  status?: 'Open' | 'In Progress' | 'Resolved';
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  icon: string;
  link?: string;
  screenshots: string[];
  updates: { date: string; version: string; description: string }[];
  feedback: Comment[];
}

export const projects: Project[] = [
  {
    id: 'cigarette-counter',
    title: 'Cigarette Counter',
    tagline: 'Track your smoking habits.',
    overview: 'A simple app designed to help you monitor and eventually reduce your daily cigarette intake. Set limits, track your progress, and view analytics on your habits.',
    icon: '🚬',
    link: '#',
    screenshots: ['placeholder-1', 'placeholder-2'],
    updates: [
      { date: '2023-10-01', version: '1.1.0', description: 'Added weekly analytics graph.' },
      { date: '2023-09-15', version: '1.0.0', description: 'Initial release.' },
    ],
    feedback: [
      {
        id: 'c1',
        user: 'John D.',
        rating: 5,
        text: 'Really helped me cut down from 20 to 5 a day. Simple and does exactly what it needs to.',
        date: '2023-10-05',
        developerReply: 'Thanks John! Glad to hear it is helping you.'
      },
      {
        id: 'c2',
        user: 'Sarah M.',
        rating: 4,
        text: 'Good app, but I wish there was a widget.',
        date: '2023-10-08',
      },
      {
        id: 'b1',
        user: 'AlexK',
        isBugReport: true,
        text: 'App crashes when I try to view history past 30 days.',
        date: '2023-10-10',
        status: 'Resolved',
        developerReply: 'Fixed in the upcoming 1.1.1 update! Thanks for reporting.'
      }
    ]
  },
  {
    id: 'brahmin-simulator',
    title: 'Brahmin Simulator',
    tagline: 'How long can you survive Indian Brahmin family life?',
    overview: 'A humorous text-based survival game where you navigate the daily challenges and societal expectations of growing up in a traditional Indian Brahmin family. Balance your karma, study hours, and relatives\' expectations!',
    icon: '🕉️',
    link: '#',
    screenshots: ['placeholder-3', 'placeholder-4'],
    updates: [
      { date: '2023-11-20', version: '0.9.0', description: 'Beta release with 3 playable scenarios.' }
    ],
    feedback: [
      {
        id: 'c3',
        user: 'Rajesh',
        rating: 5,
        text: 'Too real! The aunties are perfectly coded to be annoying.',
        date: '2023-11-21',
        developerReply: 'Haha, drawn from real-life experiences! Enjoy!'
      },
      {
        id: 'b2',
        user: 'GamerGuy99',
        isBugReport: true,
        text: 'Karma meter doesn\'t update after the temple visit event.',
        date: '2023-11-22',
        status: 'In Progress',
        developerReply: 'Looking into this right now. Will push a hotfix soon.'
      }
    ]
  }
];

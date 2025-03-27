## *CRUD Application with Next.js, TailwindCSS, and DaisyUI*

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![JSONPlaceholder](https://img.shields.io/badge/JSONPlaceholder-808080?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-701a75?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

A full-stack CRUD (Create, Read, Update, Delete) application built with Next.js, styled with TailwindCSS and DaisyUI, and integrated with JSONPlaceholder API. Features real-time data management, form validation, and responsive design.



## Features
- **CRUD Operations**: Create, read, update, and delete posts.
- **Optimistic UI Updates**: Instant UI changes with rollback on errors.
- **Form Validation**: Built with React Hook Form and Zod.
- **Responsive Design**: Mobile and Desktop responsive layout using DaisyUI components.
- **Toasts**: Success notifications for user actions.
- **API Integration**: Uses JSONPlaceholder for simulated backend.


## Technologies

| Category         | Technology                  |
|-----------------|----------------------------|
| **Frontend**     | Next.js (App Router), TailwindCSS, DaisyUI |
| **State Management** | React Query |
| **Form Handling** | React Hook Form, Zod |
| **Scripting Language** | JavaScript/TypeScript |
| **API** | JSONPlaceholder |


## Setup and Run Locally

### Prerequisites
- Node.js ≥18.x
- npm ≥9.x

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Priyanshu-Bagasi/ContactWise-Project.git
   cd ContactWise-Project

2. Install dependencies:
   ```sh
   npm install @tanstack/react-query @tanstack/react-query-devtools daisyui react-hook-form @hookform/resolvers zod

3. Start the development server:
   ```sh
   npm run dev

4. Open http://localhost:3000 in your browser.

## Challenges Faced and their Solutions

### 1. Changes in API not persisting

Challenge: Since JSONPlaceholder is a mock API, when we create, update, or delete data, it returns a success response, but the changes aren't actually saved, and hence were not reflected in the app.

Solution: Applied React Query's optimistic updates to update the UI immediately

``sh
mutationFn: async (updatedPost) => {
  if (post.id <= 100) { /* API call */ }
  else { /* Local update */ }
}

### 2. Form Validation

Challenge: Complex validation requirements.
Solution: Integrated Zod with React Hook Form:

```sh
const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(10)
});

### 3. UI Automatically Refreshing After Editing/Creating

Challenge: UI briefly resets before updating.

Solution:

*Removed automatic refetching (onSettled) in React Query.
*Used optimistic updates for instant UI changes.
*Manually updated cache in onSuccess.

```sh
onSuccess: (data) => {
  queryClient.setQueryData<Post[]>(["posts"], (old) =>
    old?.map((p) => (p.id === post.id ? { ...p, ...data } : p))
  );
}

###Developed by Priyanshu Bagasi###

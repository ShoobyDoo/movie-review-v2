import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

/*
import { supabase } from "./lib/supabase";

// Sign up
await supabase.auth.signUp({ email, password });

// Create a review
await supabase.from("reviews").insert({
  movie_id: movieId,
  rating: 8.5,
  review_text: "Amazing!",
});

// Get public reviews with user and movie info
const { data } = await supabase
  .from("reviews")
  .select(
    `
      *,
      user:profiles(*),
      movie:movies(*)
    `,
  )
  .eq("is_public", true);
*/

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => { setCount((count) => count + 1); }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default App;

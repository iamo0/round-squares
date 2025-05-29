import { useFetcher } from "react-router-dom";
import { useState } from "react";
import GamesPage from "./games-page";
import { isAdmin } from "../../main";

export default function WithAdminGamesPage() {
  const fetcher = useFetcher();

  const [isDialogShown, setIsDialogShown] = useState(false);

  return <GamesPage>
    {/**
     * NB!
     * Very annoying way to check if user is admin,
     * but otherwise page keeps to do weird caching.
     * Maybe there's another way, but first i'll
     * do other role-related code 'cause maybe there'll
     * be plenty of code with checks like that
     */}
    {isAdmin()
      ? <>
        <dialog open={isDialogShown} className="newgame">
          <fetcher.Form method="POST" onSubmit={() => setIsDialogShown(false)}>
            <button className="newgame-close" type="button" onClick={() => setIsDialogShown(false)}>Закрыть</button>
            <h2 className="newgame-title">Начать новый раунд</h2>
            <div className="newgame-controls">
              <button type="submit" name="when" value="now">Прямо сейчас</button>
              <button type="submit" name="when" value="fiv">Через пять минут</button>
            </div>
          </fetcher.Form>
        </dialog>

        <button type="button" id="button" onClick={() => setIsDialogShown(true)}>Создать раунд</button>
      </>
      : null}

  </GamesPage>
}

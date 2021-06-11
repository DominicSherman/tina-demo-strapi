import * as Options from 'enums/options';

import { NavBar } from 'components';

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar />
      <div className="h-screen flex flex-col justify-center items-center w-full">
        <h1 className="text-3xl font-semibold ml-7">{`Welcome to ${Options.APP_TITLE}`}</h1>
      </div>
    </div>
  );
}

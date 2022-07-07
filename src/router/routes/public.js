import Login from "@/components/login/Login.vue";
import Logout from "@/components/login/Logout.vue";
import GameCube from "@/components/game/GameCube.vue";
import Console from "@/components/console/Console.vue";
import Upload from "@/components/upload/Upload.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    title: "Visiophone- Login",
    component: Login,
  },
  {
    path: "/logout",
    name: "logout",
    title: "Visiophone- Logout",
    component: Logout,
  },
  {
    path: "/gamecube",
    name: "gamecube",
    title: "???",
    component: GameCube,
  },
  {
    path: "/console",
    name: "console",
    component: Console,
  },
  {
    path: "/upload",
    name: "upload",
    component: Upload,
  },
];

export default routes.map((route) => {
  const meta = {
    title: route.title,
    public: true,
    onlyLoggedOut: true,
  };
  return { ...route, meta };
});

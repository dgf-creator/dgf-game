{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  # env.GREET = "devenv";

  # https://devenv.sh/packages/
  # packages = with pkgs; [ ngrok ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    pnpm.enable = true;
  };

  # https://devenv.sh/processes/
  processes.dev.exec = "pnpm dev";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  # scripts.hello.exec = ''
  #   echo hello from $GREET
  # '';

  # https://devenv.sh/basics/
  # enterShell = ''
  # '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "pnpm:completion".exec = "source <(pnpm completion zsh)";
  #   "devenv:enterShell".after = [ "pnpm:completion" ];
  # };

  # https://devenv.sh/tesdevets/
  # enterTest = ''
  #   git --version | grep --color=auto "${pkgs.git.version}"
  # '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}

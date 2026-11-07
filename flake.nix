{
  description = "Dev environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
  };

  outputs = { self , nixpkgs ,... }: let
    system = "x86_64-linux";
  in {
    devShells."${system}".default = let
      pkgs = import nixpkgs { inherit system; };
    in pkgs.mkShell {
      packages = with pkgs; [
        nodejs_24
        pnpm
        (yarn.override { nodejs = nodejs_24; })
        zsh
      ];

      shellHook = ''
        echo "node `node --version`"
        exec zsh
      '';
    };
  };
}

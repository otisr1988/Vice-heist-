from books import create_books
from configs import generate_configs
from game_config import GameConfig
from gamestate import GameState

num_threads = 4
rust_threads = 4
batching_size = 10000
compression = True
profiling = False

num_sim_args = {
    "base": 1000000,
    "bonus": 100000,
}

def main():
    config = GameConfig()
    gamestate = GameState(config)
    
    create_books(
        gamestate=gamestate,
        config=config,
        num_sim_args=num_sim_args,
        batching_size=batching_size,
        num_threads=num_threads,
        compression=compression,
        profiling=profiling,
    )
    
    generate_configs(gamestate)
    
    print("Vice Heist (10,000x) math generation complete!")
    print("Output files in library/ folder")
    print("Publish files in library/publish_files/")

if __name__ == "__main__":
    main()

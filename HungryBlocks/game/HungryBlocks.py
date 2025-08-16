import random
import pygame as pg

class HungryBlocks:
    def __init__(self, width=800, height=600):
        # Initialize Pygame
        pg.init()
        
        # Game window
        self.screen = pg.display.set_mode((width, height))
        pg.display.set_caption("Mini Game")
        
        # Clock
        self.clock = pg.time.Clock()
        
        # Game variables
        self.running = True
        self.game_over = False
        self.dt = 1
        self.score = 0
        self.directions = [False for _ in range(4)]
        self.obstacles = []
        self.added = False
        
        # Colors
        self.c1, self.c2, self.c3 = self.getRandomColour(3)
        
        # Rectangle position
        self.x, self.y = 375, 275
        
        # Food position
        self.a, self.b = random.randint(25, 775), random.randint(25, 575)
        
        # Font
        self.score_font = pg.font.Font(None, 36)
    
    def getRandomColour(self, n=1): return tuple((random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)) for _ in range(n))
    
    def handle_events(self):
        for event in pg.event.get():
            if event.type == pg.QUIT:
                self.running = False
            elif event.type == pg.MOUSEBUTTONDOWN:
                self.c1, self.c2, self.c3 = self.getRandomColour(3)
            elif event.type == pg.KEYDOWN:
                if not self.game_over:
                    if event.key == pg.K_UP: self.directions = [True, False, False, False]
                    if event.key == pg.K_DOWN: self.directions = [False, True, False, False]
                    if event.key == pg.K_LEFT: self.directions = [False, False, True, False]
                    if event.key == pg.K_RIGHT: self.directions = [False, False, False, True]
                if event.key == pg.K_SPACE:
                    if self.game_over:
                        self.reset_game()
                    self.directions = [False for _ in range(4)]
    
    def reset_game(self):
        self.game_over = False
        self.x, self.y = 395, 295
        self.dt = 1
        self.score = 0
        self.obstacles.clear()
    
    def update_position(self):
        if self.directions[0]:  # Up
            if self.y <= 0: self.game_over = True
            else: self.y -= 1 * self.dt
        elif self.directions[1]:  # Down
            if self.y >= 550: self.game_over = True
            else: self.y += 1 * self.dt
        elif self.directions[2]:  # Left
            if self.x <= 0: self.game_over = True
            else: self.x -= 1 * self.dt
        elif self.directions[3]:  # Right
            if self.x >= 750: self.game_over = True
            else: self.x += 1 * self.dt
    
    def check_food_collision(self):
        if abs(self.x - self.a) < 5 and abs(self.y - self.b) < 5:
            self.score += 1
            self.a, self.b = random.randint(25, 725), random.randint(25, 525)
            # Avoid spawning on obstacles or rectangle
            for i in self.obstacles:
                while (abs(self.a - i[0]) < 50 and abs(self.b - i[1]) < 50) or (abs(self.a - self.x) < 50 and abs(self.b - self.y) < 50):
                    self.a, self.b = random.randint(25, 725), random.randint(25, 525)
            # Increase speed
            if self.dt < 5.0: self.dt += 0.1
            elif self.dt < 10.0: self.dt += 0.01
            elif self.dt < 15.0: self.dt += 0.0001
    
    def check_obstacle_collision(self):
        for i in self.obstacles:
            if abs(self.x - i[0]) < 50 and abs(self.y - i[1]) < 50:
                self.game_over = True
    
    def manage_obstacles(self):
        if self.score % 3 == 0 and self.score != 0 and len(self.obstacles) < 10 and not self.added: self.add_obstacle()
        if self.score % 7 == 0 and self.score != 0 and len(self.obstacles) < 25 and not self.added: self.add_obstacle()
        if self.score % 10 == 0 and self.score != 0 and len(self.obstacles) > 25 and not self.added: self.obstacles.pop(0); self.add_obstacle()
        if self.score % 3 != 0 and self.score % 7 != 0 and self.score % 10 != 0: self.added = False
    
    def add_obstacle(self):
        new = (random.randint(25, 725), random.randint(25, 525))
        while (abs(new[0] - self.x) < 50 and abs(new[1] - self.y) < 50) or (abs(new[0] - self.a) < 50 and abs(new[1] - self.b) < 50):
            new = (random.randint(25, 725), random.randint(25, 525))
        self.obstacles.append(new)
        self.added = True
    
    def draw_elements(self):
        self.screen.fill(self.c1)
        if self.game_over:
            font1, font2 = pg.font.Font(None, 74), pg.font.Font(None, 36)
            text1 = font1.render('Game over', True, self.c2)
            text2 = font2.render('Press space to restart', True, self.c2)
            score_text = self.score_font.render(f'Score: {self.score}', True, self.c2)
            self.screen.blit(score_text, (10, 10))
            self.screen.blit(text1, (250, 200))
            self.screen.blit(text2, (260, 300))
            self.obstacles.clear()
        else:
            pg.draw.rect(self.screen, self.c2, (self.x, self.y, 50, 50))
            pg.draw.rect(self.screen, self.c2, (self.a, self.b, 50, 50))
            for i in self.obstacles:
                pg.draw.rect(self.screen, self.c3, i + (50, 50))
                self.screen.blit(pg.font.Font(None, 48).render('X', True, self.c2), (i[0] + 12, i[1] + 12))
            score_text = self.score_font.render(f'Score: {self.score}', True, self.c2)
            self.screen.blit(score_text, (10, 10))
    
    def run(self):
        while self.running:
            self.handle_events()
            if not self.game_over:
                self.update_position()
                self.check_food_collision()
                self.check_obstacle_collision()
                self.manage_obstacles()
            self.draw_elements()
            pg.display.flip()
            self.clock.tick(60)

# Run the game
if __name__ == "__main__":
    game = HungryBlocks()
    game.run()
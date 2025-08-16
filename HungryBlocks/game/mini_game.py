import random
import pygame as pg
from settings import *
from utils import get_random_colour

class HungryBlocks:
    def __init__(self):
        # Initialize Pygame
        pg.init()

        # Game window
        self.screen = pg.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pg.display.set_caption("Mini Game")

        # Clock
        self.clock = pg.time.Clock()

        # Game variables
        self.running = True
        self.game_over = False
        self.speed = INITIAL_SPEED
        self.score = 0
        self.directions = [False for _ in range(4)]
        self.obstacles = []
        self.added = False

        # Colors
        self.c1, self.c2, self.c3 = get_random_colour(3)

        # Rectangle position
        self.x, self.y = 375, 275

        # Food position
        self.a, self.b = random.randint(25, SCREEN_WIDTH - FOOD_SIZE - 25), random.randint(25, SCREEN_HEIGHT - FOOD_SIZE - 25)

        # Font
        self.score_font = pg.font.Font(None, 36)

    def handle_events(self):
        for event in pg.event.get():
            if event.type == pg.QUIT:
                self.running = False
            elif event.type == pg.MOUSEBUTTONDOWN:
                self.c1, self.c2, self.c3 = get_random_colour(3)
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
        self.speed = INITIAL_SPEED
        self.score = 0
        self.obstacles.clear()

    def update_position(self):
        if self.directions[0]:  # Up
            if self.y <= 0: self.game_over = True
            else: self.y -= 1 * self.speed
        elif self.directions[1]:  # Down
            if self.y >= SCREEN_HEIGHT - RECT_SIZE: self.game_over = True
            else: self.y += 1 * self.speed
        elif self.directions[2]:  # Left
            if self.x <= 0: self.game_over = True
            else: self.x -= 1 * self.speed
        elif self.directions[3]:  # Right
            if self.x >= SCREEN_WIDTH - RECT_SIZE: self.game_over = True
            else: self.x += 1 * self.speed

    def check_food_collision(self):
        if abs(self.x - self.a) < 5 and abs(self.y - self.b) < 5:
            self.score += 1
            self.a, self.b = random.randint(25, SCREEN_WIDTH - FOOD_SIZE - 25), random.randint(25, SCREEN_HEIGHT - FOOD_SIZE - 25)
            for i in self.obstacles:
                while (abs(self.a - i[0]) < OBSTACLE_SIZE and abs(self.b - i[1]) < OBSTACLE_SIZE) or (abs(self.a - self.x) < RECT_SIZE and abs(self.b - self.y) < RECT_SIZE):
                    self.a, self.b = random.randint(25, SCREEN_WIDTH - FOOD_SIZE - 25), random.randint(25, SCREEN_HEIGHT - FOOD_SIZE - 25)
            # Increase speed
            if self.speed < 5.0: self.speed += 0.1
            elif self.speed < 10.0: self.speed += 0.01
            elif self.speed < 15.0: self.speed += 0.0001

    def check_obstacle_collision(self):
        for i in self.obstacles:
            if abs(self.x - i[0]) < OBSTACLE_SIZE and abs(self.y - i[1]) < OBSTACLE_SIZE:
                self.game_over = True

    def manage_obstacles(self):
        if self.score % 3 == 0 and self.score != 0 and len(self.obstacles) < 10 and not self.added:
            self.add_obstacle()
        if self.score % 7 == 0 and self.score != 0 and len(self.obstacles) < 25 and not self.added:
            self.add_obstacle()
        if self.score % 10 == 0 and self.score != 0 and len(self.obstacles) > 25 and not self.added:
            self.obstacles.pop(0)
            self.add_obstacle()
        if self.score % 3 != 0 and self.score % 7 != 0 and self.score % 10 != 0:
            self.added = False

    def add_obstacle(self):
        new = (random.randint(25, SCREEN_WIDTH - OBSTACLE_SIZE - 25), random.randint(25, SCREEN_HEIGHT - OBSTACLE_SIZE - 25))
        while (abs(new[0] - self.x) < RECT_SIZE and abs(new[1] - self.y) < RECT_SIZE) or (abs(new[0] - self.a) < FOOD_SIZE and abs(new[1] - self.b) < FOOD_SIZE):
            new = (random.randint(25, SCREEN_WIDTH - OBSTACLE_SIZE - 25), random.randint(25, SCREEN_HEIGHT - OBSTACLE_SIZE - 25))
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
            pg.draw.rect(self.screen, self.c2, (self.x, self.y, RECT_SIZE, RECT_SIZE))
            pg.draw.rect(self.screen, self.c2, (self.a, self.b, FOOD_SIZE, FOOD_SIZE))
            for i in self.obstacles:
                pg.draw.rect(self.screen, self.c3, i + (OBSTACLE_SIZE, OBSTACLE_SIZE))
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
            self.clock.tick(FPS)

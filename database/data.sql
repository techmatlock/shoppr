insert into "users" ("name", "username", "hashedPassword", "createdAt")
values ('Robert Smith', 'musicfan98', '$argon2id$v=19$m=65536,t=3,p=4$drFfrBXQox0Va1L2zmxD1w$SanvtYoY0Wr3y15EAsgI8qh++81a2/K3qA6Zm8DNDro', now());

insert into "users" ("name", "username", "hashedPassword", "createdAt")
values ('Mark Matlock', 'markm93', '$argon2id$v=19$m=65536,t=3,p=4$drFfrBXQox0Va1L2zmxD1w$SanvtYoY0Wr3y15EAsgI8qh++81a2/K3qA6Zm8DNDro', now());

insert into "users" ("name", "username", "hashedPassword", "createdAt")
values ('Michael Scott', 'mscott82', '$argon2id$v=19$m=65536,t=3,p=4$drFfrBXQox0Va1L2zmxD1w$SanvtYoY0Wr3y15EAsgI8qh++81a2/K3qA6Zm8DNDro', now());

insert into "shoppingItems" ("title", "userId", "createdAt")
values ('Milk', 1, now());

insert into "shoppingItems" ("title", "userId", "createdAt")
values ('Coffee', 2, now());

insert into "shoppingItems" ("title", "userId", "createdAt")
values ('Cottage cheese', 3, now());

insert into "shoppingItems" ("title", "userId", "status", "createdAt")
values ('Cottage cheese', 3, 'completed', now());

insert into "shoppingItems" ("title", "userId", "status", "createdAt")
values ('Turkey', 2, 'completed', now());

insert into "shoppingItems" ("title", "userId", "status", "createdAt")
values ('Watermelon', 1, 'completed', now());

insert into "neededBy" ("userId", "shoppingItemId")
values (3, 1);

insert into "neededBy" ("userId", "shoppingItemId")
values (2, 1);

insert into "messages" ("userId", "message", "timestamp")
values (1, 'Make sure to buy the big bag of Fuji apples', now());

insert into "messages" ("userId", "message", "timestamp")
values (2, 'Hey Tom let me know if you"re going to Costco. I may need something different.', now());

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737236874306 implements MigrationInterface {
    name = 'Migration1737236874306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8cd1abde4b70e59644c98668c06" UNIQUE ("name"), CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "canRead" boolean NOT NULL DEFAULT false, "canEdit" boolean NOT NULL DEFAULT false, "canDelete" boolean NOT NULL DEFAULT false, "canPrint" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "moduleId" uuid, CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "address" text NOT NULL, "location" text NOT NULL, "repeat" boolean NOT NULL DEFAULT false, "startCronExpression" text, "endCronExpression" text, "isActive" boolean NOT NULL DEFAULT false, "startTime" TIMESTAMP NOT NULL DEFAULT now(), "endTime" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attended" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, "memberId" text, CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_85094e79a5443171e2e9d401acd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "location" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "leaderId" text, "groupTypeId" uuid, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "members_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_762e67789052d3224b01b466a39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "members" ("id" text NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "gender" "public"."members_gender_enum" NOT NULL DEFAULT 'male', "phone" text, "birthdate" text, "email" text, "country" text, "city" text, "location" text, "zone" text, "address" text, "howTheyArrived" text, "baptizedAt" TIMESTAMP, "baptizedChurch" text, "civilStatus" "public"."members_civilstatus_enum" NOT NULL DEFAULT 'single', "weddingAt" TIMESTAMP, "firstVisitAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "spouse_id" text, "userId" uuid, "memberStatusId" uuid, CONSTRAINT "UQ_28b53062261b996d9c99fa12404" UNIQUE ("id"), CONSTRAINT "UQ_2714af51e3f7dd42cf66eeb08d6" UNIQUE ("email"), CONSTRAINT "REL_cd342ec38ad3d15fc3955532df" UNIQUE ("spouse_id"), CONSTRAINT "REL_839756572a2c38eb5a3b563126" UNIQUE ("userId"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member_parents" ("child_id" text NOT NULL, "parent_id" text NOT NULL, CONSTRAINT "PK_6c7b9accafb493ea8ebc8d033e5" PRIMARY KEY ("child_id", "parent_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d43dce2dea6e9b2970fed527e1" ON "member_parents" ("child_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1580c15a938b7b8db72daf1916" ON "member_parents" ("parent_id") `);
        await queryRunner.query(`CREATE TABLE "members_groups_groups" ("membersId" text NOT NULL, "groupsId" uuid NOT NULL, CONSTRAINT "PK_2e398b4a69ac48114e6bdf1c7bd" PRIMARY KEY ("membersId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc4a937afeb80c8b15ddd69024" ON "members_groups_groups" ("membersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_580e522d123b2f8700e6a3f643" ON "members_groups_groups" ("groupsId") `);
        await queryRunner.query(`ALTER TABLE "access" ADD CONSTRAINT "FK_6e34c980647d3db8ea3455046cb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access" ADD CONSTRAINT "FK_cd7499c442f20012a267e1a815b" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_7a932ab45da20b26714bf463831" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_f59d261f923c4bce57fa9c96f85" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_24fc38b81b44b41ea1c9d0719a8" FOREIGN KEY ("leaderId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_c9e6ef261918e606e271d1893bd" FOREIGN KEY ("groupTypeId") REFERENCES "group_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_cd342ec38ad3d15fc3955532df3" FOREIGN KEY ("spouse_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_839756572a2c38eb5a3b563126e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_0bc4a7f5492f6165fa016271c08" FOREIGN KEY ("memberStatusId") REFERENCES "members_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_parents" ADD CONSTRAINT "FK_d43dce2dea6e9b2970fed527e18" FOREIGN KEY ("child_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "member_parents" ADD CONSTRAINT "FK_1580c15a938b7b8db72daf1916f" FOREIGN KEY ("parent_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members_groups_groups" ADD CONSTRAINT "FK_bc4a937afeb80c8b15ddd690243" FOREIGN KEY ("membersId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "members_groups_groups" ADD CONSTRAINT "FK_580e522d123b2f8700e6a3f6430" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members_groups_groups" DROP CONSTRAINT "FK_580e522d123b2f8700e6a3f6430"`);
        await queryRunner.query(`ALTER TABLE "members_groups_groups" DROP CONSTRAINT "FK_bc4a937afeb80c8b15ddd690243"`);
        await queryRunner.query(`ALTER TABLE "member_parents" DROP CONSTRAINT "FK_1580c15a938b7b8db72daf1916f"`);
        await queryRunner.query(`ALTER TABLE "member_parents" DROP CONSTRAINT "FK_d43dce2dea6e9b2970fed527e18"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_0bc4a7f5492f6165fa016271c08"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_839756572a2c38eb5a3b563126e"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_cd342ec38ad3d15fc3955532df3"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_c9e6ef261918e606e271d1893bd"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_24fc38b81b44b41ea1c9d0719a8"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_f59d261f923c4bce57fa9c96f85"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_7a932ab45da20b26714bf463831"`);
        await queryRunner.query(`ALTER TABLE "access" DROP CONSTRAINT "FK_cd7499c442f20012a267e1a815b"`);
        await queryRunner.query(`ALTER TABLE "access" DROP CONSTRAINT "FK_6e34c980647d3db8ea3455046cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_580e522d123b2f8700e6a3f643"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc4a937afeb80c8b15ddd69024"`);
        await queryRunner.query(`DROP TABLE "members_groups_groups"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1580c15a938b7b8db72daf1916"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d43dce2dea6e9b2970fed527e1"`);
        await queryRunner.query(`DROP TABLE "member_parents"`);
        await queryRunner.query(`DROP TABLE "members"`);
        await queryRunner.query(`DROP TABLE "members_status"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "group_types"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "access"`);
        await queryRunner.query(`DROP TABLE "modules"`);
    }

}

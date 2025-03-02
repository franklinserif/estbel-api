import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrinterService } from '@reports/printer.service';
import { AdminsService } from '@admins/admins.service';
import { MembersService } from '@members/members.service';
import { GroupsService } from '@groups/groups.service';
import { testReport } from '@reports/documents/test.report';
import { adminsDoc } from '@reports/documents/admins.report';
import { membersDoc } from '@reports/documents/members.report';
import { groupsDoc } from '@reports/documents/groups.report';
import { groupMembersDoc } from '@reports/documents/groupMembers.report';
import { CreateReportDto } from '@reports/dto/create-report.dto';
import { MEMBERS } from '@databases/seeds/mock/members';
import { v4 as uuid } from 'uuid';
import { Member } from '@members/entities/member.entity';
import { Group } from '@groups/entities/group.entity';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let printerService: PrinterService;
  let adminsService: AdminsService;
  let membersService: MembersService;
  let groupsService: GroupsService;

  const fakePdfDocument = {} as PDFKit.PDFDocument;
  const queryParams = { where: {}, order: {} };
  const createReport: CreateReportDto = {
    rows: ['row1', 'row2'],
  } as CreateReportDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrinterService,
          useValue: { createPDF: jest.fn() },
        },
        {
          provide: AdminsService,
          useValue: { findAll: jest.fn() },
        },
        {
          provide: MembersService,
          useValue: { findAll: jest.fn() },
        },
        {
          provide: GroupsService,
          useValue: { findAll: jest.fn(), findOne: jest.fn() },
        },
      ],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
    printerService = module.get<PrinterService>(PrinterService);
    adminsService = module.get<AdminsService>(AdminsService);
    membersService = module.get<MembersService>(MembersService);
    groupsService = module.get<GroupsService>(GroupsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test', () => {
    it('should generate a test PDF using testReport', async () => {
      (printerService.createPDF as jest.Mock).mockReturnValue(fakePdfDocument);

      const result = await reportsService.test();

      expect(printerService.createPDF).toHaveBeenCalledWith(testReport());
      expect(result).toBe(fakePdfDocument);
    });
  });

  describe('adminsReport', () => {
    it('should generate an admins report PDF', async () => {
      const admins = [
        {
          id: uuid(),
          password: '2342342',
          email: 'franklinserif@gmail.com',
          member: {
            ...MEMBERS[0],
            isBaptized: false,
            weddingAt: new Date(),
            children: [],
            parents: [],
            groups: [],
            spouse: null,
            groupsLeader: null,
            attendances: null,
            memberStatus: null,
          },
        },
      ];
      (adminsService.findAll as jest.Mock).mockResolvedValue(admins);
      (printerService.createPDF as jest.Mock).mockReturnValue(fakePdfDocument);

      const result = await reportsService.adminsReport(
        queryParams,
        createReport,
      );

      expect(adminsService.findAll).toHaveBeenCalledWith(queryParams);
      expect(printerService.createPDF).toHaveBeenCalledWith(
        adminsDoc(admins as any, createReport.rows),
      );
      expect(result).toBe(fakePdfDocument);
    });
  });

  describe('membersReport', () => {
    it('should generate a members report PDF', async () => {
      const members: Omit<
        Member,
        | 'createdAt'
        | 'updatedAt'
        | 'checkFieldBeforeInsert'
        | 'checkFieldBeforeUpdate'
      >[] = [
        {
          id: uuid(),
          ...MEMBERS[0],
          isBaptized: false,
          weddingAt: new Date(),
          children: [],
          parents: [],
          groups: [],
          spouse: null,
          groupsLeader: null,
          attendances: null,
          memberStatus: null,
          birthdate: new Date().toISOString(),
        },
      ];
      (membersService.findAll as jest.Mock).mockResolvedValue(members);
      (printerService.createPDF as jest.Mock).mockReturnValue(fakePdfDocument);

      const result = await reportsService.membersReport(
        queryParams,
        createReport,
      );

      expect(membersService.findAll).toHaveBeenCalledWith(queryParams);
      expect(printerService.createPDF).toHaveBeenCalledWith(
        membersDoc(members as Member[], createReport.rows),
      );
      expect(result).toBe(fakePdfDocument);
    });
  });

  describe('groupsReport', () => {
    it('should generate a groups report PDF', async () => {
      const groups: Omit<
        Group,
        | 'checkFieldBeforeInsert'
        | 'checkFieldBeforeUpdate'
        | 'createdAt'
        | 'updatedAt'
      >[] = [
        {
          id: uuid(),
          name: 'Group',
          location: 'lorem ipsum',
          description: 'lorem ipsum',
          groupType: null,
          leader: null,
          members: [],
        },
      ];
      (groupsService.findAll as jest.Mock).mockResolvedValue(groups);
      (printerService.createPDF as jest.Mock).mockReturnValue(fakePdfDocument);

      const result = await reportsService.groupsReport(
        queryParams,
        createReport,
      );

      expect(groupsService.findAll).toHaveBeenCalledWith(queryParams);
      expect(printerService.createPDF).toHaveBeenCalledWith(
        groupsDoc(groups as Group[], createReport.rows),
      );
      expect(result).toBe(fakePdfDocument);
    });
  });

  describe('groupMembersReport', () => {
    it('should generate a group members report PDF', async () => {
      const group: Omit<
        Group,
        | 'checkFieldBeforeUpdate'
        | 'checkFieldBeforeInsert'
        | 'createdAt'
        | 'updatedAt'
      > = {
        id: uuid(),
        name: 'Group',
        location: 'lorem ipsum',
        description: 'lorem ipsum',
        groupType: null,
        leader: null,
        members: [],
      };
      (groupsService.findOne as jest.Mock).mockResolvedValue(group);
      (printerService.createPDF as jest.Mock).mockReturnValue(fakePdfDocument);

      const result = await reportsService.groupMembersReport(
        'group-id',
        createReport,
      );

      expect(groupsService.findOne).toHaveBeenCalledWith('group-id');
      expect(printerService.createPDF).toHaveBeenCalledWith(
        groupMembersDoc(group as Group, createReport.rows),
      );
      expect(result).toBe(fakePdfDocument);
    });
  });
});

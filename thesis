--
-- PostgreSQL database dump
--

\restrict CEJwJY4tDoET0vZ98CAlBvZGcXzQOCmass2sfhx4W0HL3mxPDRvDLvu094I3NXo

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: credential_type_entity_name_enum; Type: TYPE; Schema: public; Owner: thesis
--

CREATE TYPE public.credential_type_entity_name_enum AS ENUM (
    'TOR',
    'DIPLOMA',
    'HONORABLE_DISMISSAL',
    'GOOD_MORAL',
    'CERT_GRADES',
    'CERT_OF_ENROLLMENT',
    'UNITS_EARNED',
    'GWA',
    'LIST_OF_GRADES',
    'CAV'
);


ALTER TYPE public.credential_type_entity_name_enum OWNER TO thesis;

--
-- Name: record_cutoffsemester_enum; Type: TYPE; Schema: public; Owner: thesis
--

CREATE TYPE public.record_cutoffsemester_enum AS ENUM (
    '1',
    '2',
    '3'
);


ALTER TYPE public.record_cutoffsemester_enum OWNER TO thesis;

--
-- Name: record_signature_status_enum; Type: TYPE; Schema: public; Owner: thesis
--

CREATE TYPE public.record_signature_status_enum AS ENUM (
    'PENDING',
    'SUBMITTED',
    'CONFIRMED',
    'FAILED'
);


ALTER TYPE public.record_signature_status_enum OWNER TO thesis;

--
-- Name: student_academic_distinction_enum; Type: TYPE; Schema: public; Owner: thesis
--

CREATE TYPE public.student_academic_distinction_enum AS ENUM (
    'cum laude',
    'magna cum laude',
    'summa cum laude'
);


ALTER TYPE public.student_academic_distinction_enum OWNER TO thesis;

--
-- Name: student_academic_record_semester_enum; Type: TYPE; Schema: public; Owner: thesis
--

CREATE TYPE public.student_academic_record_semester_enum AS ENUM (
    '1',
    '2',
    '3'
);


ALTER TYPE public.student_academic_record_semester_enum OWNER TO thesis;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: thesis
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'signer'
);


ALTER TYPE public.user_role_enum OWNER TO thesis;

--
-- Name: user_signerposition_enum; Type: TYPE; Schema: public; Owner: thesis
--

CREATE TYPE public.user_signerposition_enum AS ENUM (
    'dean',
    'registrar',
    'president'
);


ALTER TYPE public.user_signerposition_enum OWNER TO thesis;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: credential_type_entity; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.credential_type_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name public.credential_type_entity_name_enum NOT NULL,
    "requiredSignaturesCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.credential_type_entity OWNER TO thesis;

--
-- Name: credential_type_signers; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.credential_type_signers (
    credential_type_id uuid NOT NULL,
    signer_id uuid NOT NULL
);


ALTER TABLE public.credential_type_signers OWNER TO thesis;

--
-- Name: record; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.record (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "txHash" text,
    "dataHash" text NOT NULL,
    expiration bigint NOT NULL,
    revoked boolean DEFAULT false,
    "studentId" uuid,
    "cutOffYear" text,
    "cutOffSemester" public.record_cutoffsemester_enum,
    credential_type_id uuid,
    "currentSignatures" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "credentialRef" character varying(8)
);


ALTER TABLE public.record OWNER TO thesis;

--
-- Name: record_signature; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.record_signature (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "txHash" text,
    "signedAt" timestamp without time zone DEFAULT now() NOT NULL,
    record_id uuid,
    signer_id uuid,
    status public.record_signature_status_enum DEFAULT 'PENDING'::public.record_signature_status_enum NOT NULL,
    "gasUsed" integer,
    "totalGasUsed" integer,
    "blockNumber" integer
);


ALTER TABLE public.record_signature OWNER TO thesis;

--
-- Name: record_signedBy; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public."record_signedBy" (
    "recordId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public."record_signedBy" OWNER TO thesis;

--
-- Name: record_signers; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.record_signers (
    "recordId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.record_signers OWNER TO thesis;

--
-- Name: student; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.student (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "firstName" character varying NOT NULL,
    "middleName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    address character varying NOT NULL,
    "dateOfBirth" date NOT NULL,
    "placeOfBirth" character varying NOT NULL,
    "guardianName" character varying NOT NULL,
    "yearLevel" integer DEFAULT 1 NOT NULL,
    course character varying NOT NULL,
    "elementary_Yeargraduated" integer NOT NULL,
    "secondary_Yeargraduated" integer NOT NULL,
    "elementary_Schoolname" character varying NOT NULL,
    "secondary_Schoolname" character varying NOT NULL,
    academic_distinction public.student_academic_distinction_enum,
    student_id character varying
);


ALTER TABLE public.student OWNER TO thesis;

--
-- Name: student_academic_record; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.student_academic_record (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "schoolYear" character varying NOT NULL,
    semester public.student_academic_record_semester_enum DEFAULT '1'::public.student_academic_record_semester_enum NOT NULL,
    "studentId" uuid
);


ALTER TABLE public.student_academic_record OWNER TO thesis;

--
-- Name: subject; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.subject (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying NOT NULL,
    description character varying NOT NULL,
    units integer NOT NULL
);


ALTER TABLE public.subject OWNER TO thesis;

--
-- Name: subject_taken; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public.subject_taken (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    grade numeric(4,2),
    "subjectId" uuid,
    "academicRecordId" uuid
);


ALTER TABLE public.subject_taken OWNER TO thesis;

--
-- Name: user; Type: TABLE; Schema: public; Owner: thesis
--

CREATE TABLE public."user" (
    email character varying NOT NULL,
    "firstName" text NOT NULL,
    "middleName" text,
    "lastName" text NOT NULL,
    password text NOT NULL,
    role public.user_role_enum NOT NULL,
    "signerPosition" public.user_signerposition_enum,
    "privateKey" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "publicAddress" text
);


ALTER TABLE public."user" OWNER TO thesis;

--
-- Data for Name: credential_type_entity; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.credential_type_entity (id, name, "requiredSignaturesCount", "createdAt", "updatedAt") FROM stdin;
fb1f3171-aa43-402a-a9a6-509160b35030	TOR	1	2026-01-20 15:14:35.804337	2026-01-20 15:14:35.804337
91037ec8-ab8c-4859-9348-d4d32d892a36	DIPLOMA	2	2026-01-22 21:05:32.449966	2026-01-22 21:13:52.459468
\.


--
-- Data for Name: credential_type_signers; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.credential_type_signers (credential_type_id, signer_id) FROM stdin;
fb1f3171-aa43-402a-a9a6-509160b35030	ecad3b2d-3262-4dbc-903c-5a8f086a9601
91037ec8-ab8c-4859-9348-d4d32d892a36	db9efd09-e548-4ad6-867d-f42b4dd44ad5
91037ec8-ab8c-4859-9348-d4d32d892a36	e15f4d7a-bc0d-4021-863f-a649f94004bf
\.


--
-- Data for Name: record; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.record (id, "txHash", "dataHash", expiration, revoked, "studentId", "cutOffYear", "cutOffSemester", credential_type_id, "currentSignatures", "createdAt", "credentialRef") FROM stdin;
56ca4dc9-40a7-4fb9-b910-2f35a56dda17	0x4f695e627280f81b17771a100808493ccd081b49996448d06eed39a24fd63e19	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777907549027	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-04 23:12:29.173998	HRJnRpu
6297e92c-5050-43d2-b625-10dd83344f72	0x8e339636f7e69fd168b819d274315fcd271102e0969fd9921ee7059efec9ce31	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777951922335	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-05 11:32:02.457719	CIAXEU4
2dac1b5e-4ebe-4045-bdb6-5be8a2a8b798	0x3d40230005f1f8ca61f5525a242d1751df3d1d526e8d07a68f806db57c43f730	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777951924416	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-05 11:32:04.517397	8IeZ4f0
5f607cc5-5f0e-4afe-9f17-ebd8a2ba7cf2	0x1265b79a0259c0db72f93bb3e5f9b06123bef3e8770e945f7090d66a2cd8c536	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777951925014	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-05 11:32:05.094702	Uud_kPB
97460bd1-6767-4bc4-997c-db06b2bc6169	0x01d5de351359dffbeaa2918f9c824a0f382fa69c5bef31c1a9e94e11b8abd7b7	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777904845801	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-04 22:27:25.931301	bGzTu2w
edb9b40a-8bbb-4bb7-a4d4-3fbcda23c9da	0x53215f963063738a6334c548abf8741168343cf219858d41ec5ca181547371c1	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777904979712	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-04 22:29:39.814836	m_gqYvg
fabf6b8a-2800-4040-ad93-c3a006759e3d	0xa6dd0bc30bfb04108b78d00f55e1e97d33ceadae34a8134fc5fbd39e7207251e	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777905094743	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-04 22:31:34.824355	-Ws9EV3
57a04841-94d2-45f6-b6e7-9ba40a232e77	0xd9644bffb23c22473780c7ea36984384f432508f64e18d7833cf733d408b2c88	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777905095438	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-04 22:31:35.51419	EKsnAs6
285f0421-216c-430e-8045-7503862893d3	0x1c738f5317d4ce8523dbf8e286ea6381e2b3997f7dfa153ebf85f98b4b5cf9d3	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777905096046	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-04 22:31:36.122368	rPRRm-x
b56f7e68-d3b7-4b86-baae-671c19776a5b	0x7dc3d90dd0aa4a38c4fe8ae106dae2cf82fc562d4a1d5a0be26c1094e5836f45	0x6802c0dc260798bbe022b0cc87e7ca087056deb1832c1edaaca56bba0e57b871	1777905096466	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	2022-2023	2	fb1f3171-aa43-402a-a9a6-509160b35030	1	2026-02-04 22:31:36.547937	g2ZTFHE
\.


--
-- Data for Name: record_signature; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.record_signature (id, "txHash", "signedAt", record_id, signer_id, status, "gasUsed", "totalGasUsed", "blockNumber") FROM stdin;
69112dff-cd1c-4628-8d8e-924e4c01175f	0x0bb0ae462f09f970d29c8cea25e6a6b0b947523fda41822ca43eb515adf549bc	2026-02-04 22:27:33.787588	97460bd1-6767-4bc4-997c-db06b2bc6169	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	81869	\N	74
7b85f217-151b-4df8-883a-bdc77e4d1ac3	0xf41c1cef79692091a5d7d0cc23ecea93b971928730f7648a70efb42402fd2a49	2026-02-04 22:29:45.701789	edb9b40a-8bbb-4bb7-a4d4-3fbcda23c9da	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	81869	\N	76
0431e239-c532-4e7f-ae25-1b1d5ef6be33	0x4788b099e25fc7e5e94e85ec99188f4dcfc41f2900052d5814fd90618748f6fb	2026-02-04 22:31:45.662348	285f0421-216c-430e-8045-7503862893d3	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	255623	\N	81
4d6e178d-22c0-48dc-b2c9-14c8d58b1e0c	0x4788b099e25fc7e5e94e85ec99188f4dcfc41f2900052d5814fd90618748f6fb	2026-02-04 22:31:45.662348	57a04841-94d2-45f6-b6e7-9ba40a232e77	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	255623	\N	81
f44e6b96-34fb-423f-a6f3-e4b778a24b09	0x4788b099e25fc7e5e94e85ec99188f4dcfc41f2900052d5814fd90618748f6fb	2026-02-04 22:31:45.662348	b56f7e68-d3b7-4b86-baae-671c19776a5b	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	255623	\N	81
f73d08e4-a280-4554-b458-6541fa032d31	0x4788b099e25fc7e5e94e85ec99188f4dcfc41f2900052d5814fd90618748f6fb	2026-02-04 22:31:45.662348	fabf6b8a-2800-4040-ad93-c3a006759e3d	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	255623	\N	81
5831d9b0-34f1-4518-9e89-08d20f1195bd	0xf00a8d71cb6c871c3cf6b0b1300b525dac2218a3d5d1d7716a34cf55933c3ac3	2026-02-05 10:36:30.939815	56ca4dc9-40a7-4fb9-b910-2f35a56dda17	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	81869	\N	83
56f3c48b-eca3-43bc-a6d7-62f36d3dc046	0x5dc90bcbcabf93be48705e466797432856d1b5734899bbf70735885c4563521a	2026-02-05 11:32:11.404068	2dac1b5e-4ebe-4045-bdb6-5be8a2a8b798	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	197697	\N	87
fbaf11d8-93da-4e2b-b063-52291b5f7dde	0x5dc90bcbcabf93be48705e466797432856d1b5734899bbf70735885c4563521a	2026-02-05 11:32:11.404068	5f607cc5-5f0e-4afe-9f17-ebd8a2ba7cf2	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	197697	\N	87
4a7f3162-ed8e-4c42-b9a3-adab470953eb	0x5dc90bcbcabf93be48705e466797432856d1b5734899bbf70735885c4563521a	2026-02-05 11:32:11.404068	6297e92c-5050-43d2-b625-10dd83344f72	ecad3b2d-3262-4dbc-903c-5a8f086a9601	CONFIRMED	197697	\N	87
\.


--
-- Data for Name: record_signedBy; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public."record_signedBy" ("recordId", "userId") FROM stdin;
\.


--
-- Data for Name: record_signers; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.record_signers ("recordId", "userId") FROM stdin;
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.student (id, "firstName", "middleName", "lastName", address, "dateOfBirth", "placeOfBirth", "guardianName", "yearLevel", course, "elementary_Yeargraduated", "secondary_Yeargraduated", "elementary_Schoolname", "secondary_Schoolname", academic_distinction, student_id) FROM stdin;
3ec3ec32-0860-4ba3-889b-6d9f50886dab	Joshua	Vincent	Padilla	Purok-2 Brgy. Sinidman Occ. Calbayog City	2001-07-07	Brgy. Aguit-Itan	Antonio S. Julaton	4	Bachelors of Science in Computer Science	2016	2022	Sinidman Elementary School	Oquendo National Highschool	\N	22-00377
\.


--
-- Data for Name: student_academic_record; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.student_academic_record (id, "schoolYear", semester, "studentId") FROM stdin;
cd834116-5abd-48f7-9a17-101dc3f56920	2022-2023	1	3ec3ec32-0860-4ba3-889b-6d9f50886dab
3f82d9ea-dfc4-4929-848a-34961b069878	2022-2023	2	3ec3ec32-0860-4ba3-889b-6d9f50886dab
00b801fe-26a8-4c52-9496-5ae101ef830c	2023-2024	1	3ec3ec32-0860-4ba3-889b-6d9f50886dab
\.


--
-- Data for Name: subject; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.subject (id, code, description, units) FROM stdin;
abc57cdb-0cb4-4301-af2e-882cb63b76c2	CS 101	Discrete Structures 1	3
e5501b13-f78f-4173-a254-c81b72dbf3bb	NSTP 1	ROTC 101-Reserve Officer Training Corps 1	3
6758cf10-319d-46dd-87ca-d8d812a07922	GE 1	Understanding the Self	3
77b508a3-fecd-4e7c-ab97-b2e706c730e2	GE 2	Readings in Philippine History	3
8b8babb8-70d2-406d-9bb0-1f6822a77e9d	GE Elec 1	Environmental Science	3
a31487d6-9e59-4764-8af6-1d196646dbfb	ITE 1	Introduction to Computing	3
7b654722-7b7b-436f-ad7a-5293c6cd35b1	ITE 2	Computer Programming 1	3
8032d5a3-1921-4071-a671-0b1a35797fae	PATHFit 1	Movement Competency Trainning	2
b46b5865-aa7e-43da-9893-f8825e0d416c	NSTP 2	Rotc 101 - Reserve Officers Training Corps 2	3
9eae5516-765f-42e8-894f-2497f81a5fae	PATHFit 2	Exercise-Based Fitness Activities	2
0f4368c1-6f18-4420-9b41-7d855d54ab78	GE 4	The Contemporary World	3
c3a1163c-3835-4714-930f-ce435a45b4d9	ITE 4	Computer Programming 2	3
374c05cf-bfac-4aec-8c52-0fba6ba728a7	GE 3	Mathematics in Modern World	3
c4a5fd2c-221d-4d28-b13f-e241b2587ed0	GE Elec. 2	Living in the IT Era	3
74b9dcb8-1f67-41de-a275-8109425413c8	ITE 3	Data Structures and Algorithms	3
51979863-5fc3-498f-b7fe-5e4b887eb926	CS 102	Discrete Structures 2	3
b56e28b2-6928-4775-a046-fc2546eecf1e	CS 202	Object Oriented Programming	3
36bc441f-682b-4f74-93cb-423a20a72ed0	CS MATH	Math for Computer Science	3
e5e6f64d-37c0-4a88-aaed-0feb49e35e0d	PATHFit 3	Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities	2
654bd098-b616-4966-ad39-c93b803a5503	CS 201	Algorithms and Complexity	3
92ab234c-79d2-453b-979a-3711f187a1ed	GE 5	Purposive Communication	3
77d2a2e7-f5ff-4bce-82ab-0ba1883609a5	GE 6	Science, Technology, and Society	3
b29886af-1efa-45ee-b5bd-3f88cec4106a	ITE 5	Information Management 1	3
\.


--
-- Data for Name: subject_taken; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.subject_taken (id, grade, "subjectId", "academicRecordId") FROM stdin;
e4b39469-173c-4ab5-9692-8700aef16b46	1.80	e5501b13-f78f-4173-a254-c81b72dbf3bb	cd834116-5abd-48f7-9a17-101dc3f56920
9c60ab9b-f096-47c6-8ad7-aa6a1ae65338	1.10	8032d5a3-1921-4071-a671-0b1a35797fae	cd834116-5abd-48f7-9a17-101dc3f56920
954ba53e-df2c-4adb-a527-67c097b84a30	1.30	6758cf10-319d-46dd-87ca-d8d812a07922	cd834116-5abd-48f7-9a17-101dc3f56920
f49286d2-a54c-44df-a73d-c251ddbbccc9	1.80	77b508a3-fecd-4e7c-ab97-b2e706c730e2	cd834116-5abd-48f7-9a17-101dc3f56920
8728c4f6-b1d7-4de7-9e20-16a785d293bf	1.90	8b8babb8-70d2-406d-9bb0-1f6822a77e9d	cd834116-5abd-48f7-9a17-101dc3f56920
9938d719-9da0-4cdb-9494-eea6f7692a6c	2.00	a31487d6-9e59-4764-8af6-1d196646dbfb	cd834116-5abd-48f7-9a17-101dc3f56920
81ed376d-76b8-4ad3-bc72-512e3fac7b69	2.70	7b654722-7b7b-436f-ad7a-5293c6cd35b1	cd834116-5abd-48f7-9a17-101dc3f56920
f4362180-f754-4e87-8b27-34e5b00ac546	1.70	abc57cdb-0cb4-4301-af2e-882cb63b76c2	cd834116-5abd-48f7-9a17-101dc3f56920
ed41606c-68b0-43bc-92e2-ffab30c41046	1.90	b46b5865-aa7e-43da-9893-f8825e0d416c	3f82d9ea-dfc4-4929-848a-34961b069878
e0294d70-d9c3-41c0-95d2-771efb2cc14d	1.00	9eae5516-765f-42e8-894f-2497f81a5fae	3f82d9ea-dfc4-4929-848a-34961b069878
a62e8101-1655-4550-bd3b-53fc07bf7927	1.00	0f4368c1-6f18-4420-9b41-7d855d54ab78	3f82d9ea-dfc4-4929-848a-34961b069878
a4339135-ec06-4306-a707-9d07a07fd3d8	1.00	c3a1163c-3835-4714-930f-ce435a45b4d9	3f82d9ea-dfc4-4929-848a-34961b069878
4ec9b3ae-3733-474a-a814-31a879a8c720	1.30	374c05cf-bfac-4aec-8c52-0fba6ba728a7	3f82d9ea-dfc4-4929-848a-34961b069878
7791913f-55db-4a91-98fd-9550a669995f	1.70	c4a5fd2c-221d-4d28-b13f-e241b2587ed0	3f82d9ea-dfc4-4929-848a-34961b069878
0377b403-ad27-4563-9864-851f3a3dbb94	1.70	74b9dcb8-1f67-41de-a275-8109425413c8	3f82d9ea-dfc4-4929-848a-34961b069878
22a19786-c6ae-4f7c-bfbb-cbd876703e1e	1.80	51979863-5fc3-498f-b7fe-5e4b887eb926	3f82d9ea-dfc4-4929-848a-34961b069878
ffee8905-7ae7-43b1-a184-1557495b2c25	1.00	b56e28b2-6928-4775-a046-fc2546eecf1e	00b801fe-26a8-4c52-9496-5ae101ef830c
33c961b8-392c-4259-a80b-1a14e9e7f5ac	1.20	36bc441f-682b-4f74-93cb-423a20a72ed0	00b801fe-26a8-4c52-9496-5ae101ef830c
b34d2071-39ec-4648-9efd-b967d5d1f050	1.90	e5e6f64d-37c0-4a88-aaed-0feb49e35e0d	00b801fe-26a8-4c52-9496-5ae101ef830c
d0caa252-eb8d-44e7-a28d-ce66aa1d22bb	1.30	654bd098-b616-4966-ad39-c93b803a5503	00b801fe-26a8-4c52-9496-5ae101ef830c
a85d7150-d2ad-4453-b171-e5cb6e5d9180	1.40	92ab234c-79d2-453b-979a-3711f187a1ed	00b801fe-26a8-4c52-9496-5ae101ef830c
2a7622f7-7151-4788-8194-cd684ef49bec	1.70	77d2a2e7-f5ff-4bce-82ab-0ba1883609a5	00b801fe-26a8-4c52-9496-5ae101ef830c
7415afc5-ad0c-40e8-914d-3c394cd55c17	1.80	b29886af-1efa-45ee-b5bd-3f88cec4106a	00b801fe-26a8-4c52-9496-5ae101ef830c
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public."user" (email, "firstName", "middleName", "lastName", password, role, "signerPosition", "privateKey", "createdAt", "updatedAt", id, "publicAddress") FROM stdin;
admin@email.com	admin	admin	admin	$2b$10$lu1nxyGGlmD4L3BW9IuA4.SFP4i0iciK75JE890NL2/oygOpMLBq.	admin	\N	\N	2026-01-20 01:43:35.588018	2026-01-20 01:43:35.588018	2108fc6f-3737-4df4-8f12-0c6ba6d3b34f	\N
president@email.com	president	president	president	$2b$10$yYA/jB5oHvP1YbwRyKgvbukKgOAdHx1yaC7B5jGHHxurtP2ybviZC	signer	president	bc515b118047ff9c21a8c33639d9feaa:9ab3ac13cf1c882162e9c3fc64453418fb591d0488ca645c59e7bed78c6575b8b76abc0006b68ad0d33716cce6e45885ce15f30f0653fd9400d1ee4a02d7a81f3945	2026-01-21 11:47:56.049673	2026-01-21 11:47:56.049673	e15f4d7a-bc0d-4021-863f-a649f94004bf	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
dean@email.com	dean	dean	dean	$2b$10$gkyGwVJ7ob2ojmkElM.q..WJiAoXAg2M03nfmniseAA9AHNQ7V7ci	signer	dean	9247113a5a605b74a8265d0fece6cba4:c155ade23a5f5032ca440355fd2b5cbfd13be13e86b3e2311ec231b15aadbe3413a87e003b7e1e9555218c21c296af3d30554497d14cb123f9d8e4067076184045b2	2026-01-21 22:59:38.116074	2026-01-21 22:59:38.116074	ecad3b2d-3262-4dbc-903c-5a8f086a9601	0x70997970C51812dc3A010C7d01b50e0d17dc79C8
registrar@email.com	registrar	registrar	registrar	$2b$10$jq9WT7OJUVhn2WRfqYgwxeB3difDC6T4gUr9ofa1mwMXAFKwzfYXa	signer	registrar	e95fdabef9ca704fdd299bb3632d20b9:cac6f55815b8744ae7350e89cb157a92652e676cdc5b70c4a4cf18de4ee905e7633e9a2d93af1aca28011bc6c050328896c6a71787ed990f41117ea15895e03fd139	2026-01-22 21:34:00.313021	2026-01-22 21:34:00.313021	db9efd09-e548-4ad6-867d-f42b4dd44ad5	0x90F79bf6EB2c4f870365E785982E1f101E93b906
\.


--
-- Name: subject PK_12eee115462e38d62e5455fc054; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY (id);


--
-- Name: credential_type_entity PK_1448aafaaffd68d63fe510f4870; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.credential_type_entity
    ADD CONSTRAINT "PK_1448aafaaffd68d63fe510f4870" PRIMARY KEY (id);


--
-- Name: student PK_3d8016e1cb58429474a3c041904; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY (id);


--
-- Name: record PK_5cb1f4d1aff275cf9001f4343b9; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY (id);


--
-- Name: credential_type_signers PK_94c1e01eb9f8983872f321ffb82; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.credential_type_signers
    ADD CONSTRAINT "PK_94c1e01eb9f8983872f321ffb82" PRIMARY KEY (credential_type_id, signer_id);


--
-- Name: student_academic_record PK_b3074bd56149997c4b4478e2d38; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.student_academic_record
    ADD CONSTRAINT "PK_b3074bd56149997c4b4478e2d38" PRIMARY KEY (id);


--
-- Name: record_signedBy PK_bda9e5b6d72ce301e15cfcd2966; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public."record_signedBy"
    ADD CONSTRAINT "PK_bda9e5b6d72ce301e15cfcd2966" PRIMARY KEY ("recordId", "userId");


--
-- Name: record_signers PK_c0b385475f4928315ea8c1667ef; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record_signers
    ADD CONSTRAINT "PK_c0b385475f4928315ea8c1667ef" PRIMARY KEY ("recordId", "userId");


--
-- Name: subject_taken PK_c369bdbd35a730b062487927388; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.subject_taken
    ADD CONSTRAINT "PK_c369bdbd35a730b062487927388" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: record_signature PK_e81be72b2e2e5c8090d4d968468; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record_signature
    ADD CONSTRAINT "PK_e81be72b2e2e5c8090d4d968468" PRIMARY KEY (id);


--
-- Name: user UQ_4b58d5137d1d27a07744cdbb1b5; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_4b58d5137d1d27a07744cdbb1b5" UNIQUE ("privateKey");


--
-- Name: user UQ_764606159294aeed20628413590; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_764606159294aeed20628413590" UNIQUE ("publicAddress");


--
-- Name: credential_type_entity UQ_95d89c9fc1453315d86c74ac758; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.credential_type_entity
    ADD CONSTRAINT "UQ_95d89c9fc1453315d86c74ac758" UNIQUE (name);


--
-- Name: record UQ_9ffcea2d565181fd5b3605f7157; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT "UQ_9ffcea2d565181fd5b3605f7157" UNIQUE ("credentialRef");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_1d98c7d8007e1ccbd63fbeaaf2; Type: INDEX; Schema: public; Owner: thesis
--

CREATE INDEX "IDX_1d98c7d8007e1ccbd63fbeaaf2" ON public.record_signers USING btree ("userId");


--
-- Name: IDX_53378a310a3101e4f21b669deb; Type: INDEX; Schema: public; Owner: thesis
--

CREATE INDEX "IDX_53378a310a3101e4f21b669deb" ON public.record_signers USING btree ("recordId");


--
-- Name: IDX_65e66f630fe0c48c7676f0ca98; Type: INDEX; Schema: public; Owner: thesis
--

CREATE INDEX "IDX_65e66f630fe0c48c7676f0ca98" ON public.credential_type_signers USING btree (signer_id);


--
-- Name: IDX_76332d42ec84ba46fe765e60fc; Type: INDEX; Schema: public; Owner: thesis
--

CREATE INDEX "IDX_76332d42ec84ba46fe765e60fc" ON public."record_signedBy" USING btree ("userId");


--
-- Name: IDX_7f3bbf806109547349be0239ae; Type: INDEX; Schema: public; Owner: thesis
--

CREATE INDEX "IDX_7f3bbf806109547349be0239ae" ON public."record_signedBy" USING btree ("recordId");


--
-- Name: IDX_bf356e896432f49059930bf6ff; Type: INDEX; Schema: public; Owner: thesis
--

CREATE UNIQUE INDEX "IDX_bf356e896432f49059930bf6ff" ON public.record_signature USING btree (record_id, signer_id);


--
-- Name: IDX_da1687b07033ff43e0cba41187; Type: INDEX; Schema: public; Owner: thesis
--

CREATE INDEX "IDX_da1687b07033ff43e0cba41187" ON public.credential_type_signers USING btree (credential_type_id);


--
-- Name: record FK_08333839da96c95347f6d23dbbe; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT "FK_08333839da96c95347f6d23dbbe" FOREIGN KEY ("studentId") REFERENCES public.student(id);


--
-- Name: record_signers FK_1d98c7d8007e1ccbd63fbeaaf23; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record_signers
    ADD CONSTRAINT "FK_1d98c7d8007e1ccbd63fbeaaf23" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: record_signers FK_53378a310a3101e4f21b669deb0; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record_signers
    ADD CONSTRAINT "FK_53378a310a3101e4f21b669deb0" FOREIGN KEY ("recordId") REFERENCES public.record(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credential_type_signers FK_65e66f630fe0c48c7676f0ca98c; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.credential_type_signers
    ADD CONSTRAINT "FK_65e66f630fe0c48c7676f0ca98c" FOREIGN KEY (signer_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subject_taken FK_6df93ef41608c1bbb2056fe3e7e; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.subject_taken
    ADD CONSTRAINT "FK_6df93ef41608c1bbb2056fe3e7e" FOREIGN KEY ("subjectId") REFERENCES public.subject(id);


--
-- Name: record_signedBy FK_76332d42ec84ba46fe765e60fc1; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public."record_signedBy"
    ADD CONSTRAINT "FK_76332d42ec84ba46fe765e60fc1" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: record_signature FK_7cd3724d7d88ed97ef458fb092c; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record_signature
    ADD CONSTRAINT "FK_7cd3724d7d88ed97ef458fb092c" FOREIGN KEY (record_id) REFERENCES public.record(id) ON DELETE CASCADE;


--
-- Name: record_signature FK_7e1bb4611da1ec53372abf2aae9; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record_signature
    ADD CONSTRAINT "FK_7e1bb4611da1ec53372abf2aae9" FOREIGN KEY (signer_id) REFERENCES public."user"(id);


--
-- Name: record_signedBy FK_7f3bbf806109547349be0239ae9; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public."record_signedBy"
    ADD CONSTRAINT "FK_7f3bbf806109547349be0239ae9" FOREIGN KEY ("recordId") REFERENCES public.record(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subject_taken FK_bbb3da1bfe207d4f44ac88a3318; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.subject_taken
    ADD CONSTRAINT "FK_bbb3da1bfe207d4f44ac88a3318" FOREIGN KEY ("academicRecordId") REFERENCES public.student_academic_record(id);


--
-- Name: record FK_d2e93f1f5f0509ae93d513ce36d; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT "FK_d2e93f1f5f0509ae93d513ce36d" FOREIGN KEY (credential_type_id) REFERENCES public.credential_type_entity(id);


--
-- Name: credential_type_signers FK_da1687b07033ff43e0cba411878; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.credential_type_signers
    ADD CONSTRAINT "FK_da1687b07033ff43e0cba411878" FOREIGN KEY (credential_type_id) REFERENCES public.credential_type_entity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_academic_record FK_e2c3685403fe46274ca390e38d1; Type: FK CONSTRAINT; Schema: public; Owner: thesis
--

ALTER TABLE ONLY public.student_academic_record
    ADD CONSTRAINT "FK_e2c3685403fe46274ca390e38d1" FOREIGN KEY ("studentId") REFERENCES public.student(id);


--
-- PostgreSQL database dump complete
--

\unrestrict CEJwJY4tDoET0vZ98CAlBvZGcXzQOCmass2sfhx4W0HL3mxPDRvDLvu094I3NXo


--
-- PostgreSQL database dump
--

\restrict 16uclg8igCnm2AFjFQtvlRGiQgODEGP4vALne2jD86zcV9vRcvoA182sOm59F7R

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
9202776a-31b8-4936-bc1a-db96dad63fd1	DIPLOMA	2	2026-02-08 17:41:08.814746	2026-02-08 17:41:08.814746
\.


--
-- Data for Name: credential_type_signers; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.credential_type_signers (credential_type_id, signer_id) FROM stdin;
9202776a-31b8-4936-bc1a-db96dad63fd1	94aa164a-4123-4d45-b24b-c4fcf72778dd
9202776a-31b8-4936-bc1a-db96dad63fd1	b79203f4-da0d-4224-bb4e-9441b78067d8
\.


--
-- Data for Name: record; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.record (id, "txHash", "dataHash", expiration, revoked, "studentId", "cutOffYear", "cutOffSemester", credential_type_id, "currentSignatures", "createdAt", "credentialRef") FROM stdin;
8f581c39-953f-44c9-be3c-830793f3e26c	0x83e7e89db204650fd1ac680a5eaa1fb9c25c3250fcb63e1dd5921af70e8c8a65	0x01a3f48d0bbc6e9551ecb46a0f4cac7e107e176c93e20ad248c1b1a5e24f1998	1778233314792	f	3ec3ec32-0860-4ba3-889b-6d9f50886dab	\N	\N	9202776a-31b8-4936-bc1a-db96dad63fd1	2	2026-02-08 17:41:58.174305	3OfBTxK
\.


--
-- Data for Name: record_signature; Type: TABLE DATA; Schema: public; Owner: thesis
--

COPY public.record_signature (id, "txHash", "signedAt", record_id, signer_id, status, "gasUsed", "totalGasUsed", "blockNumber") FROM stdin;
f4de1e02-4d32-4b17-a644-853ce16de809	0x50f5e7344a9feada56cb8a320ef91a7baf2c914a89d253f53236f88ef68c7b54	2026-02-08 17:42:12.002943	8f581c39-953f-44c9-be3c-830793f3e26c	b79203f4-da0d-4224-bb4e-9441b78067d8	CONFIRMED	84494	\N	10216652
9ab22b34-6974-4c97-9e38-dc6a0394695a	0x41fe7e5bf93374248b117c98fd2e3b60abb62ae647ec67b11b1776bb615752ad	2026-02-08 18:12:21.72911	8f581c39-953f-44c9-be3c-830793f3e26c	94aa164a-4123-4d45-b24b-c4fcf72778dd	CONFIRMED	67394	\N	10216799
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
dean@email.com	Jonathan	Edward	Harrington	$2b$10$vFRsYAQgP8J/zNYuLFyO6OUURSzGKcfIY8x9ys6tLN/4CEGHdFnKm	signer	dean	5a1ece1130579169614680f0cf83d217:3da78a5ba1ec86230e07dc21d4e73df2b38429958aff083d987442e1d9fe88d643a5200e1e914074e2aae1671e9a9538c3d49dd1c9d08ae3787c536a8ec23988	2026-02-08 17:37:46.973712	2026-02-08 17:37:46.973712	777d7825-2e08-4d37-96e6-6426c72b3161	0x48EE14195510F709d36F98e2446175Cd98f0CaF4
registrar@email.com	Melissa	Anne	Whitaker	$2b$10$IoU3C3t/q5rYDLSr9o9m6.osREXc/W84Q9/Ww8R4BmE8MOVopp0GK	signer	registrar	e28437fcd8fc7b03dc3334ab02972f1e:05f432abd50c9a960654295c5f502cbf1bcb18d1bd2bba625c7d415a2e09116c8985327a785e46f1e159ee3526bf3cfef3b641abc812dfa409efa5bb10dd3502	2026-02-08 17:38:28.701161	2026-02-08 17:38:28.701161	94aa164a-4123-4d45-b24b-c4fcf72778dd	0x1FE0359eC80190c0d92d6bA01ea97f8a8DC7f060
president@email.com	Robert	Charles	Kensington	$2b$10$voPZ8y9X1vkfkWAOAhBosOHeGNgU/qsqci7xonkw3AbKzAqt./K4a	signer	president	e1ae418cc8fa41a5266d73225d802190:813c432ce3d748a7f3c6445271edfaff9a3c541231b55114d558cf93967f6d6fb039de1bd9c4da6ab4e25ec0ebe01a05cc3a962865667695ddd6892a95adff73	2026-02-08 17:39:22.282797	2026-02-08 17:39:22.282797	b79203f4-da0d-4224-bb4e-9441b78067d8	0x15b1fBbdBDB67D8C2FCe2d724a8493279d9A21Be
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

\unrestrict 16uclg8igCnm2AFjFQtvlRGiQgODEGP4vALne2jD86zcV9vRcvoA182sOm59F7R


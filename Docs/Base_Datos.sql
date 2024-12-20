PGDMP  0    2            
    |            Register_attendance    17.0    17.0 #               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                        1262    16384    Register_attendance    DATABASE     �   CREATE DATABASE "Register_attendance" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Mexico.1252';
 %   DROP DATABASE "Register_attendance";
                     postgres    false            �            1259    16449    asistencia_id_asistencia_seq    SEQUENCE     �   CREATE SEQUENCE public.asistencia_id_asistencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.asistencia_id_asistencia_seq;
       public               postgres    false            �            1259    16436 
   asistencia    TABLE       CREATE TABLE public.asistencia (
    id_asistencia integer DEFAULT nextval('public.asistencia_id_asistencia_seq'::regclass) NOT NULL,
    id_estudiante integer,
    estado boolean,
    fecha_hora_entrada timestamp with time zone,
    fecha_hora_salida timestamp with time zone
);
    DROP TABLE public.asistencia;
       public         heap r       postgres    false    223            �            1259    16448    estudiantes_id_estudiante_seq    SEQUENCE     �   CREATE SEQUENCE public.estudiantes_id_estudiante_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.estudiantes_id_estudiante_seq;
       public               postgres    false            �            1259    16414    estudiantes    TABLE     �  CREATE TABLE public.estudiantes (
    id_estudiante integer DEFAULT nextval('public.estudiantes_id_estudiante_seq'::regclass) NOT NULL,
    id_huella integer,
    id_programa integer,
    nombre_completo character varying(255),
    primer_apellido character varying(255),
    segundo_apellido character varying(255),
    tipo_documento character varying(50),
    num_documento character varying(50),
    fecha_inicial date,
    fecha_final date,
    id_rol integer
);
    DROP TABLE public.estudiantes;
       public         heap r       postgres    false    222            �            1259    16462    huella    TABLE     \   CREATE TABLE public.huella (
    id_huella integer NOT NULL,
    huella_estudiante bytea
);
    DROP TABLE public.huella;
       public         heap r       postgres    false            �            1259    16461    huella_id_huella_seq    SEQUENCE     �   CREATE SEQUENCE public.huella_id_huella_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.huella_id_huella_seq;
       public               postgres    false    225            !           0    0    huella_id_huella_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.huella_id_huella_seq OWNED BY public.huella.id_huella;
          public               postgres    false    224            �            1259    16402    programa    TABLE     h   CREATE TABLE public.programa (
    id_programa integer NOT NULL,
    programa character varying(255)
);
    DROP TABLE public.programa;
       public         heap r       postgres    false            �            1259    16385    rol    TABLE     a   CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    descripcion character varying(255)
);
    DROP TABLE public.rol;
       public         heap r       postgres    false            �            1259    16390    usuarios    TABLE     �   CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    id_rol integer,
    username character varying(255),
    password character varying(255),
    estado character varying(50)
);
    DROP TABLE public.usuarios;
       public         heap r       postgres    false            o           2604    16465    huella id_huella    DEFAULT     t   ALTER TABLE ONLY public.huella ALTER COLUMN id_huella SET DEFAULT nextval('public.huella_id_huella_seq'::regclass);
 ?   ALTER TABLE public.huella ALTER COLUMN id_huella DROP DEFAULT;
       public               postgres    false    224    225    225                      0    16436 
   asistencia 
   TABLE DATA           q   COPY public.asistencia (id_asistencia, id_estudiante, estado, fecha_hora_entrada, fecha_hora_salida) FROM stdin;
    public               postgres    false    221   �*                 0    16414    estudiantes 
   TABLE DATA           �   COPY public.estudiantes (id_estudiante, id_huella, id_programa, nombre_completo, primer_apellido, segundo_apellido, tipo_documento, num_documento, fecha_inicial, fecha_final, id_rol) FROM stdin;
    public               postgres    false    220   �*                 0    16462    huella 
   TABLE DATA           >   COPY public.huella (id_huella, huella_estudiante) FROM stdin;
    public               postgres    false    225   �+                 0    16402    programa 
   TABLE DATA           9   COPY public.programa (id_programa, programa) FROM stdin;
    public               postgres    false    219   �+                 0    16385    rol 
   TABLE DATA           2   COPY public.rol (id_rol, descripcion) FROM stdin;
    public               postgres    false    217   P,                 0    16390    usuarios 
   TABLE DATA           R   COPY public.usuarios (id_usuario, id_rol, username, password, estado) FROM stdin;
    public               postgres    false    218   �,       "           0    0    asistencia_id_asistencia_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.asistencia_id_asistencia_seq', 1, true);
          public               postgres    false    223            #           0    0    estudiantes_id_estudiante_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 5, true);
          public               postgres    false    222            $           0    0    huella_id_huella_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.huella_id_huella_seq', 1, true);
          public               postgres    false    224            y           2606    16447    asistencia asistencia_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_pkey PRIMARY KEY (id_asistencia);
 D   ALTER TABLE ONLY public.asistencia DROP CONSTRAINT asistencia_pkey;
       public                 postgres    false    221            w           2606    16453    estudiantes estudiantes_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id_estudiante);
 F   ALTER TABLE ONLY public.estudiantes DROP CONSTRAINT estudiantes_pkey;
       public                 postgres    false    220            {           2606    16469    huella huella_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.huella
    ADD CONSTRAINT huella_pkey PRIMARY KEY (id_huella);
 <   ALTER TABLE ONLY public.huella DROP CONSTRAINT huella_pkey;
       public                 postgres    false    225            u           2606    16406    programa programa_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.programa
    ADD CONSTRAINT programa_pkey PRIMARY KEY (id_programa);
 @   ALTER TABLE ONLY public.programa DROP CONSTRAINT programa_pkey;
       public                 postgres    false    219            q           2606    16389    rol rol_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);
 6   ALTER TABLE ONLY public.rol DROP CONSTRAINT rol_pkey;
       public                 postgres    false    217            s           2606    16396    usuarios usuarios_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public                 postgres    false    218            �           2606    16454 (   asistencia asistencia_id_estudiante_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante);
 R   ALTER TABLE ONLY public.asistencia DROP CONSTRAINT asistencia_id_estudiante_fkey;
       public               postgres    false    221    220    4727            }           2606    16470 &   estudiantes estudiantes_id_huella_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_id_huella_fkey FOREIGN KEY (id_huella) REFERENCES public.huella(id_huella) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.estudiantes DROP CONSTRAINT estudiantes_id_huella_fkey;
       public               postgres    false    225    220    4731            ~           2606    16426 (   estudiantes estudiantes_id_programa_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_id_programa_fkey FOREIGN KEY (id_programa) REFERENCES public.programa(id_programa);
 R   ALTER TABLE ONLY public.estudiantes DROP CONSTRAINT estudiantes_id_programa_fkey;
       public               postgres    false    219    4725    220                       2606    16431 #   estudiantes estudiantes_id_rol_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);
 M   ALTER TABLE ONLY public.estudiantes DROP CONSTRAINT estudiantes_id_rol_fkey;
       public               postgres    false    217    220    4721            |           2606    16397    usuarios usuarios_id_rol_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);
 G   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_id_rol_fkey;
       public               postgres    false    217    218    4721               6   x�3�4�L�4202�54�52S0��20�26ѳ�0�50�"e�gi������ ~��         �   x�U�A
�0���^����	Y���z 7�	RIh�BO�H��!���������,&?$hS�C��y7�(����U%b�z]� YT�Tp�Bo㮉n�#��2���L�����o�ŸL�®�.��8�Se;ڜ��g��Fk�ފM$b�^�#�����g'7�G��p��lD�[�����(�/��Co         C   x����0�����6!��c���U7I��yi%�l	�Q�R]�6y�eZ��?�����~S1wD|�         ]   x�3�t�KK-�M-:�6�ˈ3�839?'?�3��MM�L��K�2�3t<�JR���LQŃR�3SR���\f�~�
.�i�y�)�\1z\\\ ��"u         4   x�3�tL����,.)JL�/�2�-.M,���2�t-.)M�L�+I����� I�         4   x�3�4�tL����,.)JL�/B�%�d��sqq��&e��i�T� Y�	     
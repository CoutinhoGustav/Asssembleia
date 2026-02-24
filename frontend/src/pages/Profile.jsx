import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Camera, Trash2, Save, Key, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';

// Helper function to create the cropped image
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
};

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Cropper State
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Profile Update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', { id: user.id, name, email, avatar });
            updateProfile(res.data);
            toast.success('Perfil atualizado!');
        } catch (err) {
            toast.error('Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    // Password Update
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('As senhas não coincidem');
        }
        setLoading(true);
        try {
            const res = await api.put('/auth/password', { email: user.email, currentPassword, newPassword });
            if (res.data.message === 'Senha alterada com sucesso!') {
                toast.success(res.data.message);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(res.data.message || 'Erro ao alterar senha');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.msg || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    // Delete Account
    const handleDeleteAccount = async () => {
        if (window.confirm('TEM CERTEZA? Esta ação é irreversível e excluirá todos os seus dados de administrador.')) {
            try {
                await api.delete(`/auth/account?email=${user.email}`);
                toast.success('Conta excluída');
                logout();
            } catch (err) {
                toast.error('Erro ao excluir conta');
            }
        }
    };

    // Handle Avatar Selection
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
            setAvatar(croppedImage);
            setImageToCrop(null);
            toast.success('Foto ajustada com sucesso!');
        } catch (e) {
            toast.error('Erro ao processar imagem');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-16">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 className="text-4xl font-black text-[#f5f5dc] tracking-tighter">Meu Perfil</h1>
                <p className="text-[#d1d1d1] font-medium tracking-wide">Gerenciamento ministerial e segurança</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#5a0505] p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-[#6b0a0a]"
                    >
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="flex flex-col items-center gap-4 mb-6 md:mb-10">
                                <div className="relative group">
                                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-[#3a0303] border-4 border-[#6b0a0a] shadow-2xl transition-transform group-hover:scale-105 duration-300">
                                        {avatar ? (
                                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#f5f5dc]/20 text-4xl md:text-5xl font-black uppercase">
                                                {user?.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-1 right-1 p-2 md:p-3 bg-[#f5f5dc] text-[#4a0404] rounded-2xl cursor-pointer shadow-xl hover:bg-white transition-all transform hover:rotate-12">
                                        <Camera size={20} md:size={24} strokeWidth={3} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                    </label>
                                </div>
                                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#f5f5dc]/40">Foto Ministerial</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <label className="block text-sm font-black text-[#f5f5dc]/80 mb-3 ml-1 uppercase tracking-widest">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f5f5dc]/30" size={20} />
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] text-white focus:border-[#f5f5dc] transition-all outline-none font-bold text-lg placeholder-[#f5f5dc]/10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-[#f5f5dc]/80 mb-3 ml-1 uppercase tracking-widest">E-mail</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f5f5dc]/30" size={20} />
                                        <input
                                            type="email"
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] text-white focus:border-[#f5f5dc] transition-all outline-none font-bold text-lg placeholder-[#f5f5dc]/10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-10 py-4 bg-[#f5f5dc] text-[#4a0404] rounded-2xl font-black hover:bg-white transition-all shadow-xl shadow-black/40 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Save size={22} strokeWidth={3} />
                                SALVAR ALTERAÇÕES
                            </button>
                        </form>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#5a0505] p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-[#6b0a0a]"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#4a0404] rounded-xl flex items-center justify-center text-[#f5f5dc] border border-[#6b0a0a]">
                                <Key size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black text-[#f5f5dc] tracking-tight">Segurança Ministerial</h2>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-8">
                            <div>
                                <label className="block text-sm font-black text-[#f5f5dc]/80 mb-3 ml-1 uppercase tracking-widest">Senha Atual</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f5f5dc]/30" size={20} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] text-white focus:border-[#f5f5dc] transition-all outline-none font-bold text-lg"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <label className="block text-sm font-black text-[#f5f5dc]/80 mb-3 ml-1 uppercase tracking-widest">Nova Senha</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] text-white focus:border-[#f5f5dc] transition-all outline-none font-bold text-lg"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-[#f5f5dc]/80 mb-3 ml-1 uppercase tracking-widest">Confirmar Senha</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] text-white focus:border-[#f5f5dc] transition-all outline-none font-bold text-lg"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-10 py-4 bg-transparent border-2 border-[#f5f5dc] text-[#f5f5dc] rounded-2xl font-black hover:bg-[#f5f5dc] hover:text-[#4a0404] transition-all shadow-lg active:scale-95 flex items-center justify-center"
                            >
                                ATUALIZAR SENHA
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-rose-950/20 p-10 rounded-[2.5rem] border-2 border-rose-500/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 text-rose-400 mb-6">
                            <Trash2 size={24} strokeWidth={2.5} />
                            <h2 className="text-xl font-black tracking-tighter">Zona de Perigo</h2>
                        </div>
                        <p className="text-sm text-rose-400/70 font-medium mb-8 leading-relaxed">
                            Ao excluir sua conta ministerial, todos os seus dados de acesso serão removidos permanentemente do sistema da assembleia.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            EXCLUIR MINHA CONTA
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Crop Modal */}
            <AnimatePresence>
                {imageToCrop && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#3a0303] w-full max-w-2xl rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden border border-[#5a0505] flex flex-col"
                        >
                            <div className="p-6 md:p-8 border-b border-[#5a0505] flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-[#f5f5dc] tracking-tighter">Ajustar Foto</h2>
                                    <p className="text-[#d1d1d1] text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Enquadramento Ministerial</p>
                                </div>
                                <X onClick={() => setImageToCrop(null)} className="text-[#f5f5dc]/40 cursor-pointer hover:text-white transition-colors" size={24} md:size={28} />
                            </div>

                            <div className="relative h-[300px] md:h-[400px] w-full bg-black">
                                <Cropper
                                    image={imageToCrop}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            </div>

                            <div className="p-6 md:p-10 space-y-6 md:space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] md:text-xs font-black text-[#f5f5dc]/60 uppercase tracking-widest">
                                        <span>Zoom do Ajuste</span>
                                        <span>{Math.round(zoom * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(e.target.value)}
                                        className="w-full h-2 bg-[#4a0404] rounded-lg appearance-none cursor-pointer accent-[#f5f5dc]"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                    <button
                                        onClick={showCroppedImage}
                                        className="w-full md:flex-1 py-4 bg-[#f5f5dc] text-[#4a0404] rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 hover:bg-white transition-all transform active:scale-95 order-1 md:order-2"
                                    >
                                        <Check size={22} strokeWidth={3} />
                                        CONFIRMAR
                                    </button>
                                    <button
                                        onClick={() => setImageToCrop(null)}
                                        className="w-full md:flex-1 py-4 rounded-2xl font-black bg-transparent border-2 border-[#5a0505] text-[#d1d1d1] hover:bg-[#5a0505] transition-all order-2 md:order-1"
                                    >
                                        DESCARTAR
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;

import React from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardTitle, CardBody } from '../components/Common/Card';
import ActivityFeed from '../components/Dashboard/ActivityFeed';

const Activities = () => {
    const { activities } = useData();

    return (
        <Layout title="Actividades">
            <Card>
                <CardHeader>
                    <CardTitle>Historial Completo de Actividades</CardTitle>
                </CardHeader>
                <CardBody>
                    <ActivityFeed activities={activities} />
                </CardBody>
            </Card>
        </Layout>
    );
};

export default Activities;
